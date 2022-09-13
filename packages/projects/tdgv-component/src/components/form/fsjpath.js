/**
 * Foresee High Speed Json-Path
 */
import { jsonPath } from './jsonpath';

export function FSjpath() {
  this.formData = {};
  this.kvs = [];
  this.idxReversePath = {}; // {lastNodeOfPath1: [kv1, kv2, ...], lastNodeOfPath2: [kv3, kv4, ...]}
  this.deep = 0;
  if (typeof FSjpath.prototype._inited === 'undefined') {
    FSjpath.prototype.initialize = function (rootJsonObj) {
      this.kvs = [];
      this.idxReversePath = {};
      this.formData = rootJsonObj;
      this.initKV(this.formData);
    };
    FSjpath.prototype.query = function (jpath, count) {
      const rets = [];
      const paths = this.paths(jpath);
      for (let i = 0; i < paths.length; i++) {
        rets.push(this.valueOf(paths[i]));
      }
      return rets;
    };
    FSjpath.prototype.valueOf = function (path) {
      if (path.indexOf('[*]') > 0) {
        // TODO:
      } else if (path.indexOf('[#') > 0) {
        // TODO:
      } else {
        let base = this.formData;
        path.replace(/\[([\w]+)\]/g, function ($1, $2) {
          base = base[$2];
        });
        return base;
      }
    };
    /*
     *
     *
     * */
    FSjpath.prototype.paths = function (jpath) {
      const prefix = jpath.substr(0, 1) === '$' ? '$' : '';
      const nodepath = this.normalize(jpath);
      const flagAggregation = nodepath.indexOf('[*]') > 0;
      const flagDynamicParam = nodepath.indexOf('[#') > 0;
      const flagWildcard = nodepath.indexOf('[***]') > 0; // target中是否包含通配符[***]
      let rets = [];
      let flag = false;
      if (flagAggregation || flagDynamicParam) {
        const idx = [];
        var temp = nodepath;
        temp = temp.replace(/\[([*#\d]+)\]/g, function ($1) {
          idx.push($1);
          return $1;
        });
        temp = temp.replace(/\[[#*]\]/g, '[0]').replace(/\[[#]{2}\]/g, '[99999]');
        flag = true;
        rets = this.seekingPaths(temp, prefix, flag);
        for (let i = 0; i < rets.length; i++) {
          var t = 0;
          rets[i] = rets[i].replace(/\[([*#\d]+)\]/g, function ($1) {
            return idx[t++];
          });
        }
      } else if (flagWildcard) {
        /*
         * 描述：表单规则target支持通配符[***]，如："target": "$.taxML.formContent.[***]:disabled;",
         * 		 会将数据模型taxML.formContent下所有叶子节点对应的元素置为disabled；
         * 修改人： zoufeng@foresee.cn
         * 修改日期：2017-03-13
         * */
        temp = nodepath;
        temp = temp.replace(/[.]([a-zA-Z_][\w]*)[.]/g, '[$1]').replace(/[$][.]*/, ''); // 将.换成[]；之后去掉$.或者$..,eg: $.taxML.formContent.[***] ==> [taxML][formContent].[***]
        const partPath = temp.substring(0, temp.indexOf('[***]') - 2); // 截取公式中已明确的部分路径partPath,eg:[taxML][formContent].[***]==>[taxML][formContent]
        /** 用partPath在kvs中遍历匹配，如果k对应的路径包含partPath,则把此k的path放入返回数组中 */
        for (let j = 0; j < this.kvs.length; j++) {
          const kv = this.kvs[j];
          const { k } = kv;
          if (k.indexOf(partPath) !== -1) {
            rets.push(k);

            /**
             * 因为目前在对formData建索引时，对于动态行只对第一行（即下标为0）的节点建了索引。
             * 导致取kvs时只取到了第一行的节点，因此需要补上漏掉的节点
             *补的原则如下：
             * 1.首先取出全路径里面[0]所在的位置（主要是存在两级动态行）保存在数组中
             * 2.根据数组的长度判断是否为两级动态行
             * 3.如果是普通动态行，则根据全路径拿动态行的路径，取出formdata中该动态行对象
             *      遍历该对象，替换全路径中的下标，补到rets中
             * 4.如果是两级动态行，先取父级动态行和子级动态行路径，再取出formdata中父级动态行对象
             *      遍历父级动态行，替换子级动态行路径中的0下标为父级动态行遍历的下标
             *      根据替换后的子级动态行路径，取出formdata中子级动态行对象
             *      遍历子级动态行，替换全路径中父级动态行和子级动态行的下标，补到rets中
             */
            const pos = k.indexOf('[0]');
            if (pos !== -1) {
              var indexs = new Array();
              k.replace(/\[\d+\]/g, function () {
                const index = arguments[1];
                indexs.push(index);
              });

              if (indexs.length === 1) {
                var path = k.substring(0, indexs[0]);
                path = path.replace(/\[([a-zA-Z_][\w]*)\]/g, '.$1');
                // var arr = eval("formData" + path);
                const arr = jsonPath(this.formData, `$${path}`, { resultType: 'VALUE' })[0];
                if (arr && arr.length > 1) {
                  for (var l = 1; l < arr.length; l++) {
                    var kk = k.replace('[0]', `[${l}]`);
                    rets.push(kk);
                  }
                }
              } else if (indexs.length === 2) {
                let path1 = k.substring(0, indexs[0]);
                path1 = path1.replace(/\[([a-zA-Z_][\w]*)\]/g, '.$1');
                let path2 = k.substring(0, indexs[1]);
                path2 = path2.replace(/\[([a-zA-Z_][\w]*)\]/g, '.$1');
                // var arr1 = eval("formData" + path1);
                const arr1 = jsonPath(this.formData, `$${path1}`, { resultType: 'VALUE' })[0];
                if (arr1) {
                  for (var l = 0; l < arr1.length; l++) {
                    var path = path2.replace('[0]', `[${l}]`);
                    // var arr2 = eval("formData" + path);
                    const arr2 = jsonPath(this.formData, `$${path}`, { resultType: 'VALUE' })[0];
                    if (arr2) {
                      for (let m = 0; m < arr2.length; m++) {
                        if (l === 0 && m === 0) {
                          // this.kvs中已经有[0][0]的索引了，不需要重复放到rets中
                          continue;
                        }
                        var kk =
                          k.substring(0, indexs[1]).replace('[0]', `[${l}]`) +
                          k.substring(indexs[1]).replace('[0]', `[${m}]`);
                        rets.push(kk);
                      }
                    }
                  }
                }
              }
            }
          }
        }
      } else {
        // Narrow the scan range
        rets = this.seekingPaths(nodepath, prefix, flag);
      }
      return rets.length > 0 ? rets : false;
    };

    // 因变量未使用$..所以要去除首字符为.的符号 JamsonWu 2018-08-13
    FSjpath.prototype.getPathEx = function (path) {
      // if (path.indexOf(".") == 0) {
      //   path = path.substr(1);
      // }
      return path;
    };
    /*
     * 根据nodePath到数据节点中匹配全路径，并返回全路径
     *
     * */
    FSjpath.prototype.seekingPaths = function (nodepath, prefix, flag) {
      let rets = [];
      let lstSeeking;
      const ln = this.lastNode(nodepath);
      if (ln !== '*' && ln !== '#') {
        lstSeeking = this.idxReversePath[ln];
        if (!lstSeeking) {
          /**
           * 在索引中没找到使用（可能是数据模型中不存在的中间节点）
           * 因此需要判断下是否已经建过索引，如果已经建过则不需要重复建索引
           */
          if (this.kvs.length === 0) {
            this.initialize(eval('window.FSformData'));
            lstSeeking = this.idxReversePath[ln];
          }
        }
        if (lstSeeking) {
          // Seeking one by one
          const { length } = lstSeeking;
          const reg = this.toRegular(nodepath);

          /**
           * 因为目前在对formData建索引时，对于动态行只对第一行（即下标为0）的节点建了索引。
           * 1.对于固定动态行公式，因为下标与索引中的不同会导致在索引中取不到全路径而编译失败
           *      所以取全路径时需要先取出公式中的所有下标并保存，在取索引时先替换下标再进行路径匹配
           *      但有些固定动态行公式下标会超出formdata中动态行数组长度，因此需要根据全路径jsonPath一下，通过才算编译成功
           *      动态行公式不需要，因为在执行阶段jsonPath会找不到全路径而导致报错（编译阶段因为在formdata补了中间节点才编译通过的）
           */

          // 取出nodepath中所有动态行下标，并保存在indexs中
          const indexs = new Array();
          nodepath.replace(/\[\d+\]/g, function () {
            const index = arguments[0];
            indexs.push(index);
          });

          for (let i = 0; i < length; i++) {
            // 把索引中的动态行下标替换为nodepath中的动态行下标
            let { k } = lstSeeking[i];
            var j = 0;
            k = k.replace(/\[\d+\]/g, function () {
              return indexs[j++];
            });

            if (reg.test(k)) {
              if (flag) {
                var isPush = true;
                for (var j = 0; j < rets.length; j++) {
                  if (prefix + k == rets[j]) {
                    isPush = false;
                    break;
                  }
                }

                if (isPush) {
                  rets.push(prefix + k);
                }
              } else {
                let path = prefix + k.replace(/\[([a-zA-Z_][\w]*)\]/g, '.$1');
                path = this.getPathEx(path);

                path = jsonPath(this.formData, path, { resultType: 'PATH' });

                if (path) {
                  var isPush = true;
                  for (var j = 0; j < rets.length; j++) {
                    if (prefix + k == rets[j]) {
                      isPush = false;
                      break;
                    }
                  }

                  if (isPush) {
                    rets.push(prefix + k);
                  }
                }
              }
            }
          }
        } else {
          const lnn = this.lastNameNode(nodepath);
          if (lnn.isArray) {
            lstSeeking = this.idxReversePath[lnn.node];
            if (lstSeeking) {
              const { length } = lstSeeking;

              // 取出nodepath中所有动态行下标，并保存在indexs中
              const indexs = new Array();
              lnn.path.replace(/\[\d+\]/g, function () {
                const index = arguments[0];
                indexs.push(index);
              });

              const reg = this.toRegular(lnn.path);
              for (let i = 0; i < length; i++) {
                // 把索引中的动态行下标替换为nodepath中的动态行下标
                let { k } = lstSeeking[i];
                let j = 0;
                k = k.replace(/\[\d+\]/g, function () {
                  return indexs[j++];
                });

                if (reg.test(k)) {
                  let isPush = true;
                  for (let j = 0; j < rets.length; j++) {
                    if (prefix + k === rets[j]) {
                      isPush = false;
                      break;
                    }
                  }

                  if (isPush) {
                    rets.push(prefix + k);
                  }
                }
              }
              for (let t = 0; t < lnn.idx.length; t++) {
                rets = rets[lnn.idx[t]];
              }
              rets = [rets];
            }
          } else {
            let path;
            if (nodepath.substr(0, 1) === '$') {
              path = nodepath;
            } else {
              path = prefix + nodepath;
            }

            // 中间节点，需要通过JSONPath.eval去formData找全路径
            rets = jsonPath(this.formData, path, { resultType: 'PATH' });

            if (rets && rets.length > 0) {
              let fullPath = rets[0];
              fullPath = fullPath.replace(/\'/g, '');
              // 存在则把找到的全路径赋值给rets
              rets[0] = fullPath;

              // 同时在索引中补上该中间节点对应的索引（针对动态行每行数据结构不一致）
              fullPath = fullPath.replace('$', '');
              fullPath = fullPath.replace(/\[\d+\]/g, '[0]');
              this.addToKV(fullPath, lnn.node);
            }
          }
        }
      }
      return rets;
    };
    /**
     * <pre>
     * $..[zbGridlbVO][0][qcwjse]
     * $..[zzssyyybnsr04_bqjxsemxb][bqjxsemxbGrid][bqjxsemxbGridlbVO][0][bqfse]
     * </pre>
     */
    FSjpath.prototype.lastNode = function (nodepath) {
      const pos = nodepath.lastIndexOf('[');
      const node = nodepath.substr(pos + 1);
      return node.substr(0, node.length - 1);
    };
    /**
     * <pre>
     * $..[zbGridlbVO][0][qcwjse]
     * $..[zzssyyybnsr04_bqjxsemxb][bqjxsemxbGrid][bqjxsemxbGridlbVO][0][bqfse]
     * </pre>
     */
    FSjpath.prototype.lastNameNode = function (nodepath) {
      const pos = nodepath.lastIndexOf('[');
      let node = nodepath.substr(pos + 1);
      node = node.substr(0, node.length - 1);
      if (isNaN(node)) {
        return { node, isArray: false, path: nodepath, idx: [] };
      }
      const tmp = this.lastNameNode(nodepath.substr(0, pos));
      return { node: tmp.node, isArray: true, path: tmp.path, idx: [node].concat(tmp.idx) };
    };
    /**
     * @param nodepath String. Normalized jpath.
     */
    FSjpath.prototype.toRegular = function (nodepath) {
      let ret = nodepath;
      ret = ret.replace(/\[99999\]/g, '[0]');
      ret = ret.replace(/\[/g, '\\[').replace(/\]/g, '\\]');
      ret = ret.replace(/\.\./g, '.*').replace(/[$]/, '');
      return new RegExp(`^${ret}$`, '');
    };
    /**
     * <pre>
     * $..nsrjbxx.nsrmc => $..[nsrjbxx][nsrmc]
     * $..zbGridlbVO[0].xxse => $..[zbGridlbVO][0][xxse]
     * $..bqjxsemxbGridlbVO[*].qcye => $..[bqjxsemxbGridlbVO][*][qcye]
     * $..zzsjmssbmxbjsxmGridlbVO[#].qmye => $..[zzsjmssbmxbjsxmGridlbVO][#][qmye]
     * $.qcs..frmx => $[qcs]..[frmx]
     * $.qcs..szhd[0].zspmDm => $[qcs]..[szhd][0][zspmDm]
     * </pre>
     */
    FSjpath.prototype.normalize = function (jpath) {
      const subx = [];
      let ret = jpath;
      let log = ret;
      ret = ret.replace(/'?\.'?|\['?/g, ';');
      ret = ret.replace(/;;;|;;/g, ';..;');
      log += ` => ${ret}`;
      ret = ret.replace(/;$|'?\]|'$/g, '');
      ret = ret.replace(/;/g, '][');
      log += ` => ${ret}`;
      ret = `${ret.replace(/\$]/g, '$')}]`;
      ret = ret.replace(/\[\.\.\]/g, '..');
      log += ` => ${ret}`;
      // console.log(log);

      // 由于变量未使用$..，所以首字符要为[ JamsonWu 2018-08-13
      // if (ret.indexOf("[") != 0) {
      //     ret = "[" + ret;
      // }

      return ret;
    };

    /**
         * 动态行新建索引的测试场景：
         1、动态行每行的数据不一定完整的情况
         2、公式下标超出formdata数据模型的情况
         3、是否存在大量相对路径通过jsonpah查找的情况
         4、是否存在需要开启所有的预编译情况
         5、*号公式、#号公式的测试场景
         6、是否存在大量中间节点
         * @param obj
         * @param prefix
         * @param name
         */
    FSjpath.prototype.initKV = function (obj, prefix, name) {
      if (typeof prefix !== 'string') {
        prefix = '';
      }
      if (obj instanceof Array) {
        /**
         * 此处增加一种判断，假如数组的元素为简单类型。即非[{'a':'01'}]格式。
         *  不考虑[[1,2,3],[2,3,4]]这种奇葩格式。暂时认为无此格式存在。
         *  同时，假如[{}]也认为是空数组。
         */
        let leaf_detect = true;
        /*
         * 对数据模型中数组里的叶子节点建检索时，不应该依据数组大小循环建索引
         * 因为在使用索引时只是取节点的路径（路径一致，仅下标不一样），而不使用节点的值
         * 所以只需要取数组中的某一个对象（取下标为0的），对这个对象下的叶子节点建索引即可。
         */
        if (obj.length > 0) {
          this.initKV(obj[0], `${prefix}[${0}]`, 0);
          if (typeof obj[0] === 'object' && obj[0] !== {}) {
            leaf_detect = false;
          }
        }

        if (leaf_detect) {
          this.addToKV(prefix, name);
        }
      } else if (typeof obj === 'function') {
        // Skip function.
      } else if (typeof obj === 'object') {
        /**
         * 编译阶段新增节点，默认为{}，也增加到节点树中。
         */
        if (obj === {}) {
          this.addToKV(prefix, name);
        }
        let cnt = 0;
        for (const n in obj) {
          cnt++;
          this.initKV(obj[n], `${prefix}[${n}]`, n);
        }
        if (cnt === 0) {
          this.addToKV(prefix, name);
        }
      } else {
        this.addToKV(prefix, name);
      }
    };

    /**
     *增加索引（建索引时节点值没有参与，因为没有使用到）
     * @param k 节点路径
     * @param n 叶子节点节点名
     */
    FSjpath.prototype.addToKV = function (k, n) {
      const tmp = { k };
      this.kvs.push(tmp);
      if (!this.idxReversePath[n]) {
        this.idxReversePath[n] = [];
      }
      this.idxReversePath[n].push(tmp);
    };

    /**
     * 增加索引（针对中间节点）
     * @param fullPath 节点全路径
     * */
    FSjpath.prototype.addToKVByFullPath = function (fullPath) {
      // 获取叶子节点
      let node = fullPath.substring(fullPath.lastIndexOf('.') + 1);

      if (node.match(/\[[0-9]+\]$/)) {
        // 如果有数组，获取数组下标（如$.hjbhssydjb.dJHbsjcxxcjbVO.zywrwlbsDm1[1]=($..hjbhsdjxxVO.djHbsjcxxcjbVO.zywrwlbsDm).split(',')[1]）
        node = node.match(/\[[0-9]+\]$/)[0].replace(/\[|\]/g, '');
      }

      let nodePath = this.normalize(fullPath);
      nodePath = nodePath.replace('$', '');
      this.addToKV(nodePath, node);
    };
  }
  // For not to do initialization twice.
  FSjpath.prototype._inited = true;
}

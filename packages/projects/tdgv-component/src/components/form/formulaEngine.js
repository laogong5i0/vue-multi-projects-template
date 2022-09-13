import { FSjpath } from './fsjpath.js';
import { jsonPath } from './jsonpath';

function FormulaObject() {
  this.strFormula; // Original formula. 原始公式字符串.
  this.id; // Formula ID from rule base. 规则库中所保存的公式ID.
  this.type; // Formula type. 规则类型（01计算公式；02校验公式；03控制公式；10初始公式；11初始并计算公式；12初始校验公式: 21提交时计算赋值公式）.
  this.desc; // Description from requirement. 本公式的需求说明.
  this.target; // Target effected by formula. 公式所影响的目标对象（主要用于控制公式：03）.
  this.tips; // User tips for verify. 用户提示信息，主要用于校验公式.
  this.strAssignment; // Original assignment's part, left of equal mark. 公式赋值部分，等号左边.
  this.strAssResolved; // Resolved assignment's part, full-path json. 解析后赋值部分（全JSON路径）.
  this.strExpression; // Original expression's part, right of equal mark. 公式计算部分，等号右边.
  this.strExpResolved; // Resolved expression's part, full-path json. 解析后计算部分（全JSON路径）.
  this.lstVariables = []; // All variables in formula. 公式中的所有变量列表.
  this.lstTargetResolved = []; // All target in resolved. 公式所涉及控制目标的解析.
  this.lstDynamicParams = []; // All dynamic parameter's name. 含动态参数公式的参数名（均以#开头）.
  this.flagAggregation = false; // Flag of aggregation, formula has [*]. 标志：聚合，公式中含有[*]数组下标.
  this.flagDynamicParam = false; // Flag of dynamic, formula has [#]. 标志：动态变量，公式中含有[#]下标.
  this.flagCompiled = false; // Flag of complied. 标志：已编译，公式是否成功编译.
  this.lastError = null; // Last error of Exception. 记录最后一次的错误信息（编译过程）.
  this.lastVerify = null; // Last verify result. 记录最后一次的校验结果.
  this.lastControl = null;
  this.flagDisable = false; // Flag of desable, runtime. 失效标志, 运行时状态, 一般用于用户手工修改后让公式不再可用.
  this.dataType = null; // 数据类型
}

export function FormulaEngine() {
  this.lstAllFormulas; // All loaded formulas. 数组, 所有载入的公式，含计算、初始化、校验.
  this.lstCalculateFormulas; // Calculate formulas about '01' or '11'. 数组, 计算公式.
  this.lstInitialFormulas; // Initial formulas about '10' or '11'. 数组, 初始化公式.
  this.lstVerifyFormulas; // Verify formulas about '02','13'. 数组, 校验公式.
  this.lstControlFormulas; // Control formulas about '03','13'. 数组, 控制公式.
  this.lstCalculate2SubmitFormulas; // Calculate formulas about '21'. 数组, 提交前赋值、计算公式.
  this.idxVariable2NoPass; // Recorder variable of not passed verifies.
  this.idxVariable2Control; // Index for variable referenced by control-formula. 索引，记录变量所影响的控制公式。
  this.idxAssign2Formulas; // Use for duplicate assignment detection. 索引, 用于检查重复公式, 关键字为赋值部分.
  this.idxId2Formulas; // Index of formula by formulaId. 索引, 主键索引, 公式ID.
  this.failedFormulas; // Loaded or compile failed formulas. 数组，解析失败的公式.
  this.idxVariable2Formula; // Index for variable referenced by formula. 索引, 反向变量索引用于处理公式级联.
  this.idxCurrentVariable2Control;
  this.flagExecuteInitial = true;
  this.jp = new FSjpath();
  if (typeof FormulaEngine._inited === 'undefined') {
    FormulaEngine.prototype.regBasket = /\[(\d+)\]/g;
    FormulaEngine.prototype.regAssignMark = /[^!=><]=[^=><]/;

    /**
     * PUBLIC: Load formulas from JSON, as array. <BR>
     * 外部方法：从JSON数组中装载公式组（字符串形式）.
     * @param formulas JSON-Object: Formulas array from rule-base. JSON对象：从规则库导出的公式数组.
     */
    FormulaEngine.prototype.loadFormulas = function (formulas) {
      // console.log("加载公式列表");
      let _ms_ = new Date().getTime();
      // Check parameter
      if (formulas) {
        if (!formulas instanceof Array) {
          throw 'Parameter formulas is not a array!';
        }
        if (formulas.length <= 0) {
          throw 'Parameter formulas is empty!';
        }
      } else {
        throw `Parameter formulas illegal: ${formulas}`;
      }
      // Do clean up the instance formulas information.
      this.doClean();
      // Load formula
      for (let i = 0; i < formulas.length; i++) {
        const objFormula = this.createFormulaObject(formulas[i]);
        this.add2List(objFormula); // Append to all those various list.
      }
      // Check time.
      _ms_ = new Date().getTime() - _ms_;
      console.log(`FormulaEngine: Formulas [${this.lstAllFormulas.length}] loaded, spend ${_ms_}ms.`);
    };

    /**
     * PRIVATE: Create formula object from string, did not compile. <BR>
     * 内部方法：根据公式字符串来创建公式对象，尚未进行公式编译（预处理）。
     * @param jsonFormula JSON-Object: Formula information from rule-base. JSON对象：从规则库导出的单条公式信息.
     *
     * <pre>
     * jsonFormula = {
     *     'id' : 0, // Formula ID from rule base. 规则库中所保存的公式ID.
     *     'type' : '00', // Formula type. 规则类型（01计算公式；02校验公式；10初始公式；11初始并计算公式；12初始校验公式）.
     *     'desc' : '', // Description from requirement. 本公式的需求说明.
     *     'formula' : '', // Original formula in string. 原始公式字符串.
     *     'tips' : ''// User tips for verify. 用户提示信息，主要用于校验公式.
     * }
     * </pre>
     *
     * @returns FormulaObject.
     */
    FormulaEngine.prototype.createFormulaObject = function (jsonFormula, oldFormula) {
      let objFormula = new FormulaObject();
      if (oldFormula) {
        objFormula = oldFormula;
        objFormula.lastError = undefined;
      }
      objFormula.strFormula = jsonFormula.formula;
      objFormula.id = jsonFormula.id;
      objFormula.type = jsonFormula.type;
      objFormula.desc = jsonFormula.desc;
      objFormula.tips = jsonFormula.tips;
      objFormula.target = jsonFormula.target;
      objFormula.flagAggregation = false;
      objFormula.flagDynamicParam = false;
      objFormula.flagCompiled = false;
      objFormula.lastError = null;
      objFormula.lastVerify = null;
      objFormula.lastControl = null;
      objFormula.excelRef = jsonFormula.excelRef || null;
      objFormula.validSheetName = jsonFormula.validSheetName || null;
      objFormula.dataType = jsonFormula.dataType;
      if (!objFormula.id) {
        objFormula.id = Math.random(); // Auto generate id for empty-id.
      }
      // Search equal mark to split the assignment's part.
      const { strFormula } = objFormula;
      let posEqual = this.searchAssignMark(strFormula);
      if (objFormula.type == '01' || objFormula.type == '11' || objFormula.type == '10') {
        // Formula type: '01' calculate; '02' verify; '11' calculate & initialize; '10' initialize.
        if (posEqual <= 0 || strFormula.indexOf('=') != posEqual) {
          if (posEqual > 0) {
            console.log(`Formula assignment part too complex: ${objFormula.strFormula}`);
          }
          posEqual = -1;
        }
      }
      if (posEqual <= 0) {
        objFormula.strAssignment = null;
        objFormula.strExpression = strFormula;
      } else {
        if (objFormula.type == 2) {
          console.log(`${objFormula.type} ==> ${objFormula.strFormula}`);
        }
        objFormula.strAssignment = strFormula.substr(0, posEqual).trim();
        objFormula.strExpression = strFormula.substr(posEqual + 1).trim();
      }
      if (objFormula.type == '01') {
        // 如果是计算公式，处理调'N'&'Y'改为'N'+'Y'
        objFormula.strExpression = objFormula.strExpression.replace(/([^&])&{1}([^&])/g, '$1+$2');
      }
      return objFormula;
    };

    /**
     * PRIVATE: Append formula to all those various list, according to type. <BR>
     * 内部方法：将公式对象按照公式类型增加到各分类公式列表中, 便于后续索引使用.
     * @param objFormula FormulaObject. 公示对象.
     * @returns boolean, 公式类型是否能识别.
     */
    FormulaEngine.prototype.add2List = function (objFormula) {
      switch (objFormula.type) {
        case '01': // Calculate formulas
          this.lstCalculateFormulas.push(objFormula);
          break;
        case '02': // Verify formulas
        case '02_01': // dynamic Verify formulas
        case '12': // Verify & Initial formulas
          this.lstVerifyFormulas.push(objFormula);
          break;
        case '11': // Calculate & Initial formulas
          this.lstCalculateFormulas.push(objFormula);
          this.lstInitialFormulas.push(objFormula);
          break;
        case '10': // Initial formulas
          this.lstInitialFormulas.push(objFormula);
          break;
        case '03':
        case '13':
          this.lstControlFormulas.push(objFormula);
          break;
        case '21':
          this.lstCalculate2SubmitFormulas.push(objFormula);
          break;
        default:
          console.log(`FormulaEngine: Formula type not supported[${objFormula.type}]: ${objFormula.strFormula}`);
          return false;
      }
      if (objFormula.type === '10') {
        this.lstAllFormulas.splice(this.pointStart10++, 0, objFormula);
        this.pointStart11++;
      } else if (objFormula.type === '11') {
        this.lstAllFormulas.splice(this.pointStart11++, 0, objFormula);
      } else {
        this.lstAllFormulas.push(objFormula);
      }
      if (this.idxId2Formulas[objFormula.id]) {
        const err = `WARN: formulaId duplicated [${objFormula.id}], original: ${
          this.idxId2Formulas[objFormula.id].strFormula
        }, newer: ${objFormula.strFormula}`;
        console.log(err);
        objFormula.lastError = err;
        objFormula.flagCompiled = false;
        return false;
      }
      this.idxId2Formulas[objFormula.id] = objFormula;
      return true;
    };

    /**
     * PRIVATE: Clean all those various list and index.
     * @param flagDoNotClear boolean. True: clear all list and index; Flase: clear index and remain list.
     */
    FormulaEngine.prototype.doClean = function (flagDoNotClear) {
      if (!flagDoNotClear) {
        this.lstAllFormulas = []; // All loaded formulas
        this.lstCalculateFormulas = []; // Calculate formulas about '01' or'11'
        this.lstInitialFormulas = []; // Initial formulas about '10' or '11'
        this.lstVerifyFormulas = []; // Verify formulas about '02'
        this.lstControlFormulas = [];
        this.lstCalculate2SubmitFormulas = []; // Calculate formulas about '21'
        this.idxId2Formulas = {};
        this.pointStart10 = 0;
        this.pointStart11 = 0;
      }
      this.idxVariable2NoPass = {};
      this.idxVariable2Control = {};
      this.idxAssign2Formulas = {};
      this.failedFormulas = [];
      this.idxVariable2Formula = {};
      this.idxCurrentVariable2Control = {};
    };

    /**
     * PUBLIC: Initialize after formulas loaded. <BR>
     * 外部方法：初始化公式引擎，需要先准备好公式.
     * @param newBasename String The base data-object used for calculation. 对象名称（字符串）, 记录公式计算所依赖JSON对象.
     * @returns none.
     */
    FormulaEngine.prototype.initialize = function (newBasename) {
      // debugger;
      let flagDoInitial = true;
      if (this.basename && newBasename === true) {
        flagDoInitial = false;
      } else {
        if (!newBasename && !(newBasename instanceof String)) {
          throw 'Initialize parameter illegal, needs String.';
        }
        try {
          /* if (!eval(newBasename)) {
                        throw "Initialize parameter's object not founded";
                    } */
        } catch (ex) {
          throw `Initialize basename's object illegal [${newBasename}]: ${ex}`;
        }
        this.basename = newBasename;
        // 根据服务端返回执行初始化标识最终决定是否执行初始化
        /* if(!flagExecuteInitial) {
                    flagDoInitial = false;
                } */
      }

      // Init the FSjpath
      // console.log("引入Fsjpath");
      this.jp.initialize(formData);
      // Initial:
      this.procVerifyFormulas = []; // Temporary variable for processing: involved verify-formulas.
      this.procContorlFormulas = [];
      this.procVariableInStack = {}; // Temporary variable for processing: variable in calling-stack.
      // Do compile, calculate and verify
      this.compileAll();
      if (flagDoInitial) {
        this.applyInitialFormulas();
      }
      // Destroy:
      this.procVerifyFormulas = null;
      this.procVariableInStack = null;
    };

    /**
     * PRIVATE: Compile formula base on the JSON-Data.<BR>
     * 内部方法：基于JSON对象模型来进行公式编译（预处理）。
     */
    FormulaEngine.prototype.compileAll = function () {
      let _ms_ = new Date().getTime();
      if (this.lstAllFormulas.length < 1) {
        throw 'Formula list is empty!';
      }
      if (typeof this.basename === 'undefined' || this.basename == null) {
        throw 'Did not setting JSON-Data basename.';
      }
      // Resolve all shorted-jpath to full-jpath.
      // 将所有公式中的所有缩略路解析为全路径.
      console.log('compile');
      for (var i = 0; i < this.lstAllFormulas.length; i++) {
        var objFormula = this.lstAllFormulas[i];
        if (objFormula.id == localStorage.getItem('formulaId')) {
          console.log('编译调试');
        }
        // Resolve shorted-jpath
        if (this.resolveFormula(objFormula)) {
          // Recognize variable of assignment's part.
          if (objFormula.strAssResolved) {
            // 解析等号左边的动态参数
            this.recognizeAssignmentVariable(objFormula);
          }
          // Recognize all variable in formula.
          // 解析等号右边的变量（单词）
          this.recognizeExpressionVariable(objFormula);
          //
          objFormula.flagCompiled = !objFormula.lastError;
        } else {
          this.failedFormulas.push(objFormula);
        }
      }

      // 对于解析失败的公式重新编译一次临时处理办法: 主要是修正公式之间依赖问题，比如：A公式依赖项，要在B公式执行之后才产生的
      // 要扩展公式定义类型type=11，才能解决这个问题，todo...
      for (let k = 0; k < this.failedFormulas.length; k++) {
        var objFormula = this.failedFormulas[k];
        objFormula.lastError = null;
        if (objFormula.id == localStorage.getItem('formulaId')) {
          console.log('编译调试');
        }
        // Resolve shorted-jpath
        if (this.resolveFormula(objFormula)) {
          // Recognize variable of assignment's part.
          if (objFormula.strAssResolved) {
            // 解析等号左边的动态参数
            this.recognizeAssignmentVariable(objFormula);
          }
          // Recognize all variable in formula.
          // 解析等号右边的变量（单词）
          this.recognizeExpressionVariable(objFormula);
          //
          objFormula.flagCompiled = !objFormula.lastError;
        }
      }

      // Index all variable.
      // 建立索引：公式引擎所有的公式中的变量建立关联公式数组
      for (var i = 0; i < this.lstAllFormulas.length; i++) {
        var objFormula = this.lstAllFormulas[i];
        if (objFormula.id == '06100101010301004') {
          // console.log('a')
        }
        // Duplicate assignment detection
        if (this.rightSubstr(objFormula.type, 1) == '1' && objFormula.strAssResolved) {
          if (this.idxAssign2Formulas[objFormula.strAssResolved]) {
            console.log(
              `WARNING! Duplicate assignment detected of [${objFormula.strAssResolved}]:\n--Exist: ${
                this.idxAssign2Formulas[objFormula.strAssResolved].strFormula
              }\n--Newer: ${objFormula.strFormula}`,
            );
          } else {
            this.idxAssign2Formulas[objFormula.strAssResolved] = objFormula;
          }
        }
        // Build up the cascade reference
        if (objFormula.flagCompiled) {
          for (let t = 0; t < objFormula.lstVariables.length; t++) {
            const strVar = objFormula.lstVariables[t];
            if (!this.idxVariable2Formula[strVar]) {
              this.idxVariable2Formula[strVar] = [];
            }
            this.idxVariable2Formula[strVar].push(objFormula);
          }
        }
      }
      // Decompose targets of control-formula.
      // 解析控制公式中的目标项.
      for (var i = 0; i < this.lstControlFormulas.length; i++) {
        var objFormula = this.lstControlFormulas[i];
        this.strFormulaEx(objFormula);
        if (objFormula.flagCompiled) {
          this.decomposeFormulaTargets(objFormula);
          this.resolveFormulaTarget(objFormula);
        }
      }

      // 解析检验公式中的目标项.
      for (var i = 0; i < this.lstVerifyFormulas.length; i++) {
        var objFormula = this.lstVerifyFormulas[i];
        // console.log("objFormula.id="+objFormula.id)
        if (objFormula.id == '06100103030100033A') {
          console.log('debug');
        }
        this.strFormulaEx(objFormula);

        if (objFormula.flagCompiled) {
          this.decomposeFormulaTargets(objFormula);
          try {
            this.resolveFormulaTips(objFormula);
          } catch (ex) {}
          this.resolveFormulaTarget(objFormula);
        }
      }

      // Index all control-variable's target
      // 建立索引：控制公式的变量
      _ms_ = new Date().getTime() - _ms_;
      console.log(
        `FormulaEngine: Formulas [${this.lstAllFormulas.length}] compiled, [${this.failedFormulas.length}] failed, spend ${_ms_}ms.`,
      );

      // 输出编译失败的公式ID
      const failIds = [];
      this.failedFormulas.forEach((p) => {
        failIds.push(p.id);
      });
      console.log(`Compile Failure Formula Ids:${JSON.stringify(failIds)}`);
    };

    /**
     * 对公式中的Target中所包含的各jpath进行解析，主要是将其从短路径形式解析为全路径形式
     */
    FormulaEngine.prototype.resolveFormulaTarget = function (objFormula) {
      if (!this.checkIsJpathExpresstion(objFormula.target)) {
        return;
      }
      try {
        const strResolve = this.resolveExpression(objFormula.target);
        if (strResolve) {
          const target = strResolve.resolved;
          if (target) {
            objFormula.target = target.replace(/\$\./g, '');
          }
        }
      } catch (ex) {
        console.log(`resolveExpression error${ex.message}`);
      }
    };

    /**
     * 对公式中的Tips中所包含的各jpath进行解析，主要是将其从短路径形式解析为全路径形式
     */
    FormulaEngine.prototype.resolveFormulaTips = function (objFormula) {
      if (!this.checkIsJpathExpresstion(objFormula.tips)) {
        return;
      }
      const strResolve = this.resolveExpression(objFormula.tips);
      if (strResolve) {
        const tips = strResolve.resolved;
        if (tips) {
          objFormula.tips = tips.replace(/\$\./g, '');
        }
      }
    };

    /**
     * 替换解析后的表达式 JamsonWu 2018-08-15
     */
    FormulaEngine.prototype.strFormulaEx = function (objFormula) {
      if (objFormula.strAssResolved && objFormula.strExpResolved) {
        objFormula.strFormula = `${objFormula.strAssResolved}=${objFormula.strExpResolved}`;
      } else if (objFormula.strExpResolved) {
        objFormula.strFormula = objFormula.strExpResolved;
      }
    };
    /**
     * 对公式中所包含的各jpath进行解析，主要是将其从短路径形式解析为全路径形式。
     */
    FormulaEngine.prototype.resolveFormula = function (objFormula) {
      var tmp;
      // Resolve expression part, right of equal-mark
      try {
        tmp = this.resolveExpression(objFormula.strExpression);
        objFormula.strExpResolved = tmp.resolved;

        // 增加聚合表达式计算处理，暂处理计算公式 JamsonWu 2018-08-17
        if (tmp.flagAggregation && (objFormula.type == '01' || objFormula.type == '02')) {
          var tmp = this.resolveExpressionFull(objFormula.strExpression);
          if (tmp) {
            objFormula.strExpResolved = tmp.resolved;
          }
        }

        if (objFormula.strExpResolved) {
          // 公式表达式右边如果存在$.，则替换为空,兼容旧版的公式规则 JamsonWu 2018-08-15
          // 目前原始表达式左右两边、解析后的左右两边设置为相同，待验证 todo...
          objFormula.strExpResolved = objFormula.strExpResolved.replace(/\$\./g, '');
          objFormula.strExpression = objFormula.strExpResolved;
        }
        objFormula.flagAggregation = tmp.flagAggregation;
        objFormula.flagDynamicParam = tmp.flagDynamicParam;
      } catch (ex) {
        objFormula.lastError = ex;
        // console.log("公式解析失败,ID="+objFormula.id +","+ ex.toString());
        return false;
      }
      // Resolve assignment part, left of equal-mark
      try {
        if (objFormula.strAssignment) {
          tmp = this.resolveExpression(objFormula.strAssignment);
          objFormula.strAssResolved = tmp.resolved;

          if (objFormula.strAssResolved) {
            // 公式表达式左边如果存在$.，则替换为空,兼容旧版的公式规则 JamsonWu 2018-08-15
            // 目前原始表达式左右两边、解析后的左右两边设置为相同，待验证 todo...
            objFormula.strAssResolved = objFormula.strAssResolved.replace(/\$\./g, '');
            objFormula.strAssignment = objFormula.strAssResolved;
          }
        }
      } catch (ex) {
        // Try create assignment node

        let strAss = objFormula.strAssignment;
        var node = '';
        if (strAss.indexOf('[#') > 0) {
          // 2、计算动态参数变量的总数，以便进行遍历计算
          strAss = strAss.replace(/\[#\]/g, '[*]');
          var node = strAss.substring(strAss.lastIndexOf('.') + 1);
          strAss = strAss.substring(0, strAss.lastIndexOf('.'));
          strAss = jsonPath(formData, strAss, { resultType: 'PATH' });
          if (strAss) {
            for (let i = 0; i < strAss.length; i++) {
              strAss[i] = strAss[i].replace(/\[\'/g, '.').replace(/\'\]/g, '');
            }
          } else {
            // 动态行lb节点不存在时，采用旧逻辑。节点执行期新增。
            strAss = [objFormula.strAssignment.replace(/\[#\]/g, '[0]')];
            node = '';
          }
        } else {
          // 非动态行时，默认单节点处理
          strAss = [objFormula.strAssignment];
          node = '';
        }
        for (let k = 0; k < strAss.length; k++) {
          const prePath = strAss[k];
          const stuffPath = node ? `.${node}` : '';
          const fullPath = this.jpathNodeCreate(prePath + stuffPath);
          if (fullPath) {
            const tmpPath = fullPath.replace(`[${k}]`, '[#]');
            objFormula.strAssResolved = tmpPath.replace(/\$\./g, '');
            objFormula.strAssignment = objFormula.strAssResolved;
            // 对中间节点增加索引
            this.jp.addToKVByFullPath(fullPath);
          } else {
            // Create node failed.
            console.log(`Failed while trying create assignment's json-node  [${strAss}]: ${ex}`);
            objFormula.lastError = ex;
            return false;
          }
        }

        // Try create assignment node
        // var strAss = objFormula.strAssignment;
        // if (strAss.indexOf("[#]") > 0) {
        //     strAss = strAss.replace(/\[#\]/g, "[0]");
        // }
        // var fullpath = this.jpathNodeCreate(strAss);
        // if (fullpath) {
        //     objFormula.strAssResolved = fullpath;
        //     //动态添加的节点，在期初报文中是不存在的,todo...
        //     // 公式表达式左边如果存在$.，则替换为空,兼容旧版的公式规则 JamsonWu 2018-08-15
        //     // 目前原始表达式左右两边、解析后的左右两边设置为相同，待验证 todo...
        //     objFormula.strAssignment = fullpath.replace(/\$\./g, "");
        //     objFormula.strAssResolved = objFormula.strAssignment;

        // } else {
        //     // Create node failed.
        //     console.log("Failed while trying create assignment's json-node  [" + strAss
        //         + "]: " + ex);
        //     objFormula.lastError = ex;
        //     return false;
        // }
      }
      this.strFormulaEx(objFormula);
      return true;
    };
    FormulaEngine.prototype.jpathNodeCreate = function (strJpath) {
      if (strJpath == '$..zzssyyxgmnsrySbSbbdxxVO.zzsxgmfjssb.bqsfsyxgmyhzc') {
        console.log('jpathNodeCreate');
      }
      if (strJpath.substr(0, 2) !== '$.') {
        console.log(`JPath illegal while trying jpathNodeCreate, should start with '$.' :${strJpath}`);
        return;
      }
      // var objBase = formData;
      const objBase = formData;
      let pos = strJpath.lastIndexOf('.');
      let posShorted = strJpath.lastIndexOf('..');
      posShorted = posShorted < 0 ? 0 : posShorted + 1;
      while (pos > posShorted) {
        const partial = strJpath.substr(0, pos);
        let obj = partial === '$' ? [objBase] : jsonPath(objBase, partial);
        if (obj !== false) {
          if (obj.length === 1) {
            obj = obj[0];
            if (typeof obj === 'object') {
              const flag = this.createSubPath(obj, strJpath.substr(pos + 1));
              if (flag) {
                eval('window.FSformData' + '= objBase');
                obj = jsonPath(objBase, strJpath, { resultType: 'PATH' });
                if (obj && obj.length === 1) {
                  return obj[0].replace(/\[\'/g, '.').replace(/\'\]/g, '');
                }
              }
              if (obj) {
                console.log(`Failed while trying createSubPath: ${flag}, ${obj.length}`);
              }
            } else {
              console.log(
                `Failed while trying jpathNodeCreate, found parent '${partial}' is not object: ${typeof obj}`,
              );
              return;
            }
          } else {
            console.log(
              `Failed while trying jpathNodeCreate, found parent '${partial}' return multi-result: ${obj.length}`,
            );
            return;
          }
        }
        pos = strJpath.lastIndexOf('.', pos - 1);
      }
    };
    FormulaEngine.prototype.createSubPath = function (objBase, subPath) {
      try {
        const nodes = subPath.split('.');
        let base = objBase;
        let i = 0;
        do {
          let name = nodes[i];
          const pos = name.indexOf('[');
          let sub = null;
          if (pos > 0) {
            // TODO: Can't support more than one [], like [1][2]
            // or ['a']['b']
            sub = name.substr(pos + 1, name.indexOf(']') - pos - 1);
            name = name.substr(0, pos);
          }
          if (name.length == 0) {
            return false;
          }
          if (typeof base[name] === 'undefined' || base[name] == null) {
            if (sub) {
              base[name] = [];
            } else {
              base[name] = {};
            }
          }
          if (typeof base !== 'object') {
            console.log(`Failed while trying create subpath [${subPath}]: ${nodes[i - 1]}is not a object.`);
          }
          base = base[name];
          if (sub) {
            base[sub] = {};
            base = base[sub];
          }
        } while (++i < nodes.length);
        return true;
      } catch (ex) {
        // Create node failed.
        console.log(`Failed while trying create subpath [${subPath}]: ${ex}`);
        return false;
      }
    };
    /**
     * 根据nodepath来搜索所有引用了该变量的公式，包括动态公式和聚合公式
     */
    FormulaEngine.prototype.getInvolvedFormulas = function (nodepath, dynamicParams) {
      // alert(999);
      // debugger;
      const { regBasket } = this;
      const lstFormulas = [];
      // 1、Simple formula matching. 简单引用匹配（也即变量直接写在公式中）
      if (this.idxVariable2Formula[nodepath]) {
        // 这种情况下说明变量即便是动态行，其动态参数值也不适用于被引用公式，类似于：
        // $.others[1].s 变动引发公式： $.vos[#].a = $.vos[#].b + $.others[1].s
        this.addingFormulaList(lstFormulas, this.idxVariable2Formula[nodepath], null);
      }
      // 2、Trying dynamic formula. 尝试匹配动态参数公式，类似于：
      // $.vos[#].b 变动引发公式： $.vos[#].a = $.vos[#].b + 100
      let tmp = nodepath;
      if (dynamicParams) {
        // TODO: Currently only support one dynamic parameter.
        regBasket.lastIndex = 0;
        tmp = tmp.replace(regBasket, '[#]');
        if (this.idxVariable2Formula[tmp]) {
          this.addingFormulaList(lstFormulas, this.idxVariable2Formula[tmp], dynamicParams);
        }
      }
      // 3、Trying aggregation formula. 尝试匹配聚合参数公式，类似于：
      // $.vos[#].b 变动引发公式： $.some.thing.hj = SUM($.vos[*].b)
      if (tmp.indexOf('[#]') > 0) {
        regBasket.lastIndex = 0;
        tmp = tmp.replace(/\[#\]/g, '[*]');
        if (this.idxVariable2Formula[tmp]) {
          this.addingFormulaList(lstFormulas, this.idxVariable2Formula[tmp], null);
        }
      }
      // 4、Exclude self. 消除自运算导致的循环引用，类似于：
      // $.vos[0].a = SUM($.vos[*].a) - $.vos[0].a
      let jpath = `$.${nodepath}`;
      // 要去除$.符号 JamsonWu 2018-08-28
      jpath = nodepath;
      for (let i = 0; i < lstFormulas.length; i++) {
        if (jpath === lstFormulas[i].strAssResolved) {
          lstFormulas.splice(i, 1);
          i--;
        }
      }
      return lstFormulas;
    };
    FormulaEngine.prototype.addingFormulaList = function (lstBase, lstAdding, dynamicParams) {
      for (let idx = 0; idx < lstAdding.length; idx++) {
        const objFormula = lstAdding[idx];
        if (!objFormula.flagDisable) {
          if (objFormula.type == '01' || objFormula.type == '10' || objFormula.type == '11') {
            lstBase.push([objFormula, dynamicParams]);
          }
        }
      }
    };

    // 因变量未使用$..所以要去除首字符为.的符号 JamsonWu 2018-08-13
    FormulaEngine.prototype.getPathEx = function (path) {
      // if (path.indexOf(".") == 0) {
      //     path = path.substr(1);
      //   }
      return path;
    };
    /**
     * 判断当前路径在期初报文中是否已存在 JamsonWu 2018-08-14
     * @param {*} path
     */
    FormulaEngine.prototype.hasNodeInFormData = function (path) {
      return this.jp.paths(`$..${path}`);
    };
    /**
     * 对字符串表达式中所包含的各jpath进行解析，主要是将其从短路径形式解析为全路径形式。
     */
    FormulaEngine.prototype.resolveExpression = function (strExp) {
      let lastPos = 0;
      let strFast = '';
      let flagAggregation = false;
      // 因变量未使用$..所以正则要增加? JamsonWu 2018-08-13
      const regFastJpath = /([$]([.\w]+|\[([*#]|[\d]+)\])+)/g;
      // var regFunc =/[.\w]+\(\)$/;
      do {
        const fastResult = regFastJpath.exec(strExp);
        // 如果是JS函数，则不进行处理 JamsonWu 2018-08-14
        // var funcResult = regFunc.exec(strExp);
        // if (funcResult) {
        //     console.log("当前公式是函数："+ strExp);
        // }
        // console.log(result);
        if (fastResult == null) {
          strFast += strExp.substr(lastPos, strExp.length - lastPos);
          break;
        }
        strFast += strExp.substr(lastPos, fastResult.index - lastPos);
        const fastJpaths = this.jp.paths(fastResult[0]);
        if (!fastJpaths) {
          throw `Resolve expression failed: JsonPath [${fastResult[0]}] in [${strExp}] select empty, can't resolve the full-path.`;
        } else if (fastJpaths.length > 1) {
          // confusingDetecte
          this.confusingDetecte(fastResult[0], strExp);
        }
        for (let i = 0; i < fastJpaths.length; i++) {
          fastJpaths[i] = fastJpaths[i].replace(/\[([a-zA-Z_][\w]*)\]/g, '.$1');
          fastJpaths[i] = this.getPathEx(fastJpaths[i]);
        }
        if (fastJpaths.length > 1) {
          strFast += `[${fastJpaths}]`;
        } else {
          strFast += fastJpaths[0];
        }
        lastPos = regFastJpath.lastIndex;
      } while (regFastJpath.lastIndex < strExp.length);
      if (strExp.indexOf('[*]') >= 0) {
        flagAggregation = true;
      }
      // return { 'resolved' : strRet, 'flagAggregation' : flagAggregation, 'flagDynamicParam' : (strExp.indexOf("[#]") > 0) };
      return {
        resolved: strFast,
        flagAggregation,
        flagDynamicParam: strExp.indexOf('[#]') > 0,
      };
    };
    /**
     * 判断是否为JsonPath表达式
     * @param {} objFormula
     */
    FormulaEngine.prototype.checkIsJpathExpresstion = function (strExpression) {
      if (!strExpression) {
        return false;
      }
      const regJpath = /([$]([.\w]+|\[[.*\w#()]*\])+)/g;
      const check$ = strExpression.match(regJpath);
      if (!check$) {
        return false;
      }

      return true;
    };

    FormulaEngine.prototype.recognizeAssignmentVariable = function (objFormula) {
      const { strAssResolved } = objFormula;
      // 增加测试是否存在$.表达式，如果不存在，则先保留以前的处理方式 JamsonWu 2018-08-14
      let regJpath = /([$]([.\w]+|\[[.*\w#()]*\])+)/g;
      const regDynamic = /\[(#[A-Za-z]{0,1})\]/g;
      const check$ = strAssResolved.match(regJpath);
      if (!check$) {
        regJpath = /(([.\w]+|\[[.*\w#()]*\])+)/g;
      }

      let tmpResult = regJpath.exec(strAssResolved);
      if (tmpResult == null) {
        throw `Assignment recognize failed: ${objFormula.strAssResolved} in ${objFormula}`;
      }
      if (regJpath.lastIndex >= strAssResolved.length) {
        if (regJpath.exec(strAssResolved) != null) {
          throw `Assignment too complex: ${objFormula.strAssResolved} in ${objFormula}`;
        }
      }
      do {
        tmpResult = regDynamic.exec(strAssResolved);
        if (tmpResult == null) {
          break;
        }
        objFormula.lstDynamicParams.push(tmpResult[1]);
      } while (regDynamic.lastIndex < strAssResolved.length);
      if (objFormula.lstDynamicParams.length > 0) {
        objFormula.flagDynamicParam = true;
      }
    };
    /**
     * 获取数组路径
     * @param {*} path
     */
    FormulaEngine.prototype.getPathEx = function (path) {
      return path.replace(/(.*[A-Za-z]+[\w]?)\.(\d+)/g, '$1[$2]');
    };
    /**
     * 数组简写解析 aa.d.bb.d.cc.d = aa[d].bb[d].cc[d] JamsonWu 2018-09-30
     * @param {*} objFormula
     * @param {*} curVariable
     */
    FormulaEngine.prototype.parseArrayAbbr = function (objFormula, curVariable) {
      const destStrVariable = curVariable.replace(/(.*[A-Za-z]+[\w]?)\.(\d+)/g, '$1[$2]');
      if (destStrVariable != curVariable) {
        objFormula.strExpResolved = objFormula.strExpResolved.replace(curVariable, destStrVariable);
        objFormula.strExpression = objFormula.strExpResolved;
      }
    };

    FormulaEngine.prototype.recognizeExpressionVariable = function (objFormula) {
      if (objFormula.id == '3') {
        // debugger
        // console.log('a')
      }
      const { strExpResolved } = objFormula;
      // 增加测试是否存在$.表达式，如果不存在，则先保留以前的处理方式 JamsonWu 2018-08-14
      let regJpath = /([$]([.\w]+|\[[.*\w#()]*\])+)/g;
      const check$ = strExpResolved.match(regJpath);
      if (!check$) {
        regJpath = /(([.\w]+|\[[.*\w#()]*\])+)/g;
      }
      let tmpResult;
      const tmp = strExpResolved.match(regJpath);

      do {
        tmpResult = regJpath.exec(strExpResolved);
        // console.log(strExpResolved + " :> " + tmpResult);
        if (tmpResult == null) {
          break;
        }
        let strVariable = tmpResult[0];
        // 增加$.的兼容处理
        if (strVariable.substr(0, 2) == '$.') {
          strVariable = strVariable.substr(2);
        }

        // 数组简写处理
        this.parseArrayAbbr(objFormula, strVariable);

        if (strVariable.indexOf('[]') > 0) {
          throw `Illegal empty basket: ${tmpResult[0]} in ${strExpResolved}`;
        }
        if (strVariable.indexOf('[#]') > 0) {
          objFormula.flagDynamicParam = true;
        }
        let flagAdd = false;
        if (objFormula.flagAggregation) {
          // TODO: Should do some merge to reduce the number of variable.
          strVariable = strVariable.replace(this.regBasket, '[*]');
          if (strVariable.indexOf('[*]') >= 0) {
            let t = 0;
            for (; t < objFormula.lstVariables.length; t++) {
              if (objFormula.lstVariables[t] == strVariable) {
                break;
              }
            }
            if (t >= objFormula.lstVariables.length) {
              flagAdd = true;
            }
          } else {
            // 针对 a = b + SUM();需要将b也存入 lstVariables 中
            flagAdd = true;
          }
        } else {
          flagAdd = true;
        }
        if (flagAdd) {
          objFormula.lstVariables.push(strVariable);
        }
      } while (regJpath.lastIndex < strExpResolved.length);
    };

    /**
     * PRIVATE: Apply all initial formulas, including calculate formula and verify formula.<BR>
     * 内部方法：执行所有初始化公式，包括计算公式和校验公式.
     * extends:此方法中增加了1、初始化执行逻辑；2、增加附表逻辑；3、减少附表逻辑
     */
    FormulaEngine.prototype.applyInitialFormulas = function () {
      const _start_ = new Date().getTime();
      const _this = this;

      // First: execute initial calculate formula. 先执行初始化计算公式.
      // warning 加载保存数据、外部导入数据时，屏蔽执行初始化计算公式
      if (this.flagExecuteInitial) {
        this.procVerifyFormulas = [];
        this.procVariableInStack = {};
        this.calculationPlanningOfList(this.lstInitialFormulas, undefined, true);
      }
      // 1.有暂存时，执行具有暂存执行标志的公式 A by C.Q 20180402
      // 2.有新增附表时，执行新增附表的公式
      // 3.有减表时执行减表公式
      if (!this.flagExecuteInitial) {
        // 获取新增附表列表
        let xzfbs = [];
        // 新增附表数量
        let xzfbsl = 0;
        if (this.otherParams && this.otherParams.xzfb) {
          xzfbs = this.otherParams.xzfb.split(',');
          xzfbsl = xzfbs.length;
        }

        // 如果存在减少附表的情况
        // 减表对应的公式对象
        const jbObjFormulas = {};
        let jsfbs;
        if (this.otherParams && this.otherParams.jsfb) {
          jsfbs = this.otherParams.jsfb.split(',');
          // 减表初始化数据模型对应的formulaEngine
          // 1、针对初始化公式创建索引
          let leftFlag = false;
          let rightFlag = false;
          for (var i = 0, l = this.formulaEngineJb.lstInitialFormulas.length; i < l; i++) {
            var objFormula = this.formulaEngineJb.lstInitialFormulas[i];
            if (objFormula.flagCompiled) {
              for (var j = 0, fblen = jsfbs.length; j < fblen; j++) {
                var jsfb = jsfbs[j];
                // 左边节点在减表附表中
                if (
                  typeof objFormula.strAssResolved !== 'undefined' &&
                  objFormula.strAssResolved != null &&
                  objFormula.strAssResolved.indexOf(jsfb) > -1
                ) {
                  leftFlag = true;
                  break;
                } else if (!rightFlag) {
                  // 右边节点在减表附表中
                  if (
                    typeof objFormula.strExpResolved !== 'undefined' &&
                    objFormula.strExpResolved != null &&
                    objFormula.strExpResolved.indexOf(jsfb) > -1
                  ) {
                    rightFlag = true;
                  }
                }
              }
              if (!leftFlag && rightFlag) {
                // 把左边节点不在减表附表中、右边节点在减表附表中的公式加入到jbObjFormulas中
                jbObjFormulas[objFormula.strAssResolved + objFormula.type] = 'N';
              }
              leftFlag = false;
              rightFlag = false;
            }
          }
          // 2、针对计算公式创建索引
          for (var i = 0, l = this.formulaEngineJb.lstCalculateFormulas.length; i < l; i++) {
            var objFormula = this.formulaEngineJb.lstCalculateFormulas[i];
            if (objFormula.flagCompiled) {
              for (var j = 0, fblen = jsfbs.length; j < fblen; j++) {
                var jsfb = jsfbs[j];
                // 左边节点在减表附表中
                if (
                  typeof objFormula.strAssResolved !== 'undefined' &&
                  objFormula.strAssResolved != null &&
                  objFormula.strAssResolved.indexOf(jsfb) > -1
                ) {
                  leftFlag = true;
                  break;
                } else if (!rightFlag) {
                  // 右边节点在减表附表中
                  if (
                    typeof objFormula.strExpResolved !== 'undefined' &&
                    objFormula.strExpResolved != null &&
                    objFormula.strExpResolved.indexOf(jsfb) > -1
                  ) {
                    rightFlag = true;
                  }
                }
              }
              if (!leftFlag && rightFlag) {
                // 把左边节点不在减表附表中、右边节点在减表附表中的公式加入到jbObjFormulas中
                jbObjFormulas[objFormula.strAssResolved + objFormula.type] = 'N';
              }
              leftFlag = false;
              rightFlag = false;
            }
          }
        }

        const lstZcInit = [];
        // 循环初始化公式
        for (var i = 0, l = this.lstInitialFormulas.length; i < l; i++) {
          var objFormula = this.lstInitialFormulas[i];
          if (objFormula.zcInit == 'Y') {
            lstZcInit.push(objFormula);
          } else {
            // 处理新增附表逻辑
            if (xzfbsl > 0) {
              for (var j = 0; j < xzfbsl; j++) {
                const xzfb = xzfbs[j];
                if (
                  objFormula.flagCompiled &&
                  ((typeof objFormula.strAssResolved !== 'undefined' &&
                    objFormula.strAssResolved != null &&
                    objFormula.strAssResolved.indexOf(xzfb) > -1) ||
                    (typeof objFormula.strExpResolved !== 'undefined' &&
                      objFormula.strExpResolved != null &&
                      objFormula.strExpResolved.indexOf(xzfb) > -1))
                ) {
                  // 如果JSON全路径的公式左边或者JSON全路径的公式的右边包含新增的附表，则这些公式需要执行
                  console.log(`增加附表时需要执行的公式：${objFormula.id}=${objFormula.strAssResolved}`);
                  lstZcInit.push(objFormula);
                }
              }
            } else {
              // 5、处理减少附表逻辑
              if (this.otherParams && this.otherParams.jsfb) {
                // 执行formula中的（11、01、10）公式，且这些公式的左边节点必须在formula2中的左边节点中存在
                if (objFormula.flagCompiled) {
                  if (jbObjFormulas[objFormula.strAssResolved + objFormula.type]) {
                    // TODO 此处有bug
                    // 当一个格子存在两条初始化公式时，此逻辑错误，因为只执行了第一条公式 todo 黄健帮忙找个实例
                    console.log(`减少附表时需要执行的公式1：${objFormula.id}=${objFormula.strAssResolved}`);
                    lstZcInit.push(objFormula);
                    // delete jbObjFormulas[objFormula.id];
                    // 表示此jpath已经执行过
                    jbObjFormulas[objFormula.strAssResolved + objFormula.type] = 'Y';
                  }
                }
              }
            }
          }
        }

        // 6、执行触发计算公式
        if (this.otherParams && this.otherParams.jsfb) {
          // 执行formula中的（11、01、10）公式，且这些公式的左边节点必须在formula2中的左边节点中存在
          for (var i = 0, l = this.lstCalculateFormulas.length; i < l; i++) {
            var objFormula = this.lstCalculateFormulas[i];
            if (objFormula.flagCompiled) {
              // 处理减少附表逻辑,删除非减少附表的公式
              if (jbObjFormulas[objFormula.strAssResolved + objFormula.type]) {
                // 当一个格子存在两条初始化公式时，此逻辑错误，因为只执行了第一条公式 todo 黄健帮忙找个实例
                console.log(`减少附表时需要执行的公式1：${objFormula.id}=${objFormula.strAssResolved}`);
                lstZcInit.push(objFormula);
                jbObjFormulas[objFormula.strAssResolved + objFormula.type] = 'Y';
              }
            }
          }
        }

        this.procVerifyFormulas = [];
        this.procVariableInStack = {};
        this.calculationPlanningOfList(lstZcInit, undefined, true, {
          type: '_zcInit',
        });

        // 7、减表时赋值，并执行
        let exp;
        let val;
        $.each(jbObjFormulas, function (jpath, val) {
          // 判断jpath是否已经在前面执行过
          if (val === 'N') {
            // 去掉最后两位公式类型
            jpath = jpath.substr(0, jpath.length - 2);
            if (_this.existJpathInFormData(jpath.replace('$', 'FSformData2'))) {
              eval(`val =${jpath.replace('$', 'FSformData2')}`);
              // formData中存在节点则执行
              if (_this.existJpathInFormData(jpath.replace('$', 'formData'))) {
                exp = `${jpath.replace('$', 'formData')}=${jpath.replace('$', 'FSformData2')}`;
                // 执行赋值
                eval(exp);
                // 根据jpath获取formdata2的节点数据，并执行到formdata节点中
                // 去掉$.
                console.log(`减少附表时需要执行的公式：${jpath.replace('$.', '')}=${val}`);
                _this.apply(jpath.replace('$.', ''), val, null);
              }
            }
          }
        });
      }

      // 执行外部导致的赋值公式，1、判断值有发生变化才需要执行
      // this.executeWbcshFormula();

      // Second: execute initial control formula. 再执行初始化控制公式.
      const controls = this.lstControlFormulas;
      for (var i = 0; i < controls.length; i++) {
        var objFormula = controls[i];
        if (objFormula.type.substr(0, 1) === '1') {
          // Checking initial sign.
          objFormula.lastControl = this.execNoCaculateFormula(objFormula);
          this.effectingControl(objFormula.lastControl, objFormula.lstTargetResolved);
        }
      }
      // Thrid: execute initial verify formula. 再执行初始化校验公式.
      const verifies = this.lstVerifyFormulas;
      this.procVerifyFormulas = [];
      for (var i = 0; i < verifies.length; i++) {
        if (verifies[i].type.substr(0, 1) === '1' || !this.flagExecuteInitial) {
          // Checking initial sign.
          // this.execNoCaculateFormula(verifies[i]);执行校验表达式没起到实际作用
          this.procVerifyFormulas.push(verifies[i]);
        }
      }

      this.applyAssociatedFormulaVerify(null);
      this.procVerifyFormulas = [];

      const _end_ = new Date().getTime();
      // hwping 增加公式执行结束标识
      this.flagExcuted = true;
      console.log(`INFO:${_start_}-${_end_}-${_end_ - _start_}ms 公式执行(applyInitialFormulas)`);
    };

    /**
     * 内部方法：依据初始给出的公式列表，查找出所有关联公式，并按照前后依赖关系进行计算。
     * @param lstFormulas 待处理公式队列：[FormulaObj, FormulaObj, ...]
     * @param dynamicParams 动态下标
     * @param flagInitial 是否初始化
     * @param iHandle 自定义处理 json 格式字符串，用于拓展处理
     * @warning Currently only support one dynamic parameter. 目前仅支持一个动态参数值.
     */
    FormulaEngine.prototype.calculationPlanningOfList = function (lstFormulas, dynamicParams, flagInitial, iHandle) {
      const lst = [];
      this.addingFormulaList(lst, lstFormulas, dynamicParams);
      // this.calculationPlanning(lst, dynamicParams, flagInitial);
      return this.calculationPlanning8DAGsorting(lst, dynamicParams, flagInitial, iHandle);
    };

    /**
     * 内部方法：采用图论中的拓扑排序命题来解决公式计算依赖关系的分析问题.<br />
     * 【拓扑排序命题】<br />
     * 拓扑排序用于解决图论中有向图的一类序列问题，拓扑排序在ACM比赛和实际生活中都比较常见，只要能将事物抽象成有向图，并要求按规则排序，那么就可以考虑拓扑排序，比如任务执行前后关系、选修课程的安排、按胜负排名次等。<br />
     * 【拓扑排序解释】<br />
     * 即在某一个有向图graph中，假设每一条有向边(u,v)代表节点u必须排在节点v的前面，那么按照这样的规则，将所有的节点进行排序，最终得出的序列就称为拓扑序。<br />
     *
     * <pre>
     * 【拓扑排序流程】
     * 总体思路：遍历节点，删除入度为0的节点，删除该节点的出连接线，然后继续下一轮遍历。
     * 特殊说明：如果某轮遍历后没有找到任何入度为0的节点，说明存在循环依赖（也即拓扑排序无解）。
     * 具体流程：
     *   (1)、找到一个没有后继的顶点(如果有一条边从A指向B,那么B是A的后继)。
     *   (2)、从图中删除这个顶点，在列表的前面插入顶点的标记。
     *   (3)、重复步骤1和2.直到所有的顶点都从图中删除。这时列表显示的顶点顺序就是拓扑排序的结果。
     * 注：环图是不能进行拓扑排序的，如果有N个顶点的有向图有超过N-1条边，那么必定存在环；拓扑排序过程可以发现环。
     * </pre>
     * <pre>
     * 【算法应用】
     * 一、标记过程（梳理依赖有向图子图的过程）：
     * 1 初始化：初始公式清单-->标记计算区&待处理队列
     * 2 枚举待处理队列，取出一条处理公式；
     * 2.1 枚举公式的赋值变量所涉及的关联公式；
     * 2.1.1 如该关联公式不存在于标记计算区，则压入待处理队列，且关联公式放入标记计算区；
     * 2.1.2 在该关联公式上标记对当前变量的依赖；
     * 2.3 继续下一枚举关联公式；
     * 3 重复执行待处理队列；
     * 4 最终得到标记计算区。
     * 二、清理过程（对标记计算区进行拓扑排序）：
     * 1 初始化：初始公式清单-->待处理队列；
     * 2 枚举待处理队列，取出一条处理公式；
     * 2.1 检查其是否仍存在变量依赖（也即入度是否为0）：
     * 2.2 从计算区去除该公式（从图中删除该节点）
     * 2.3 将公式放入拟执行队列；
     * 2.4 查找赋值变量所涉及的关联公式
     * 2.5 枚举关联公式
     * 2.5.1 删除被枚举关联公式的依赖项（删除节点相关的出连接线）
     * 3 重复执行待处理队列；
     * 4 如队列仍为空，说明存在循环依赖，异常中止；
     * 5 将最终拟执行队列提交顺序执行。
     * 三、按拓扑顺序执行计算
     * </pre>
     *
     * @param lstFormulaAndParams 待处理公式队列：[[FormulaObj, params], [FormulaObj, params], ...]
     * @param dynamicParams 暂未使用.
     * @param flagInitial 是否为初始化（初始化调用时才为true）.
     * @param iHandleFn 自定义函数处理
     * @return Calculate successful, boolean. 计算是否成功, 布尔值.
     */
    FormulaEngine.prototype.calculationPlanning8DAGsorting = function (
      lstFormulaAndParams,
      dynamicParams,
      flagInitial,
      iHandle,
    ) {
      console.log(`FormulaEngine: calculationPlanning8DAGsorting(), incoming [${lstFormulaAndParams.length}]......`);
      const _start_ = new Date().getTime();
      // 一、标记过程（形成计算区，也即子图）
      const area = this.marking4DAGsorting(lstFormulaAndParams);
      const _ms_marking_ = new Date().getTime() - _start_;
      const _cnt_marking_ = this.countProperty(area);
      // 二、清理过程（逐步清理入度为0节点，形成计算顺序）
      const orderList = this.cleaning4DAGsorting(area);
      const _ms_cleaning_ = new Date().getTime() - _start_ - _ms_marking_;
      const _cnt_cleaning_ = orderList.length;
      // 三、按顺序执行计算
      // var ret = this.calculateAccordingPlan(orderList, flagInitial, iHandle);
      const _ms_calculate_ = new Date().getTime() - _start_ - _ms_cleaning_ - _ms_marking_;
      const _end_ = new Date().getTime();

      console.log(
        `INFO:${_start_}-${_end_}  标记(area) [${_cnt_marking_}] ${_ms_marking_}ms, 清理(orderList) [${_cnt_cleaning_}] ${_ms_cleaning_}ms, 计算 ${_ms_calculate_}ms. `,
      );
    };

    /**
     * 获取公式有向图列表
     */
    FormulaEngine.prototype.getOrderFormulaList = function (lstFormulaAndParams) {
      const lst = [];
      this.addingFormulaList(lst, lstFormulaAndParams);

      const _start_ = new Date().getTime();
      // 一、标记过程（形成计算区，也即子图）
      const area = this.marking4DAGsorting(lst);
      const _ms_marking_ = new Date().getTime() - _start_;
      const _cnt_marking_ = this.countProperty(area);
      // 二、清理过程（逐步清理入度为0节点，形成计算顺序）
      const orderList = this.cleaning4DAGsorting(area);
      const _ms_cleaning_ = new Date().getTime() - _start_ - _ms_marking_;
      const _cnt_cleaning_ = orderList.length;
      return orderList;
    };

    /**
     * 内部方法：基于图论中的拓扑排序命题，对标记计算区进行拓扑排序.
     * @param area 标记计算区：{formulaId1:{obj:FormulaObj, depends:{paramName1, paramName2}, params:[]}, formulaId2:{}}
     */
    FormulaEngine.prototype.cleaning4DAGsorting = function (area) {
      // 1 初始化：标记区公式清单-->待处理队列；
      const orderList = [];
      const total = this.countProperty(area);
      let cnt = 0;
      let sum = 0;
      let loop = 0; // cnt 用于发现循环依赖；sum 记录总计算量；loop 循环次数。
      do {
        cnt = 0;
        loop++;
        // 2 枚举待处理队列，取出一条处理公式；
        for (const id in area) {
          // 2.1 检查其是否仍存在变量依赖（也即入度是否已经为0）：
          const item = area[id];
          // 当此公式存在依赖其他公式时继续找下一个公式。
          if (this.countProperty(item.depends) > 0) {
            continue;
          }
          cnt++;
          sum++;
          // 2.2 从计算区去除该公式（从图中删除该节点）
          delete area[id];
          const objFormula = item.obj;
          const formulaParams = item.params;
          // 2.3 将公式放入拟执行队列；
          orderList.push({
            obj: objFormula,
            params: formulaParams,
          });
          // 2.4 查找赋值变量所涉及的关联公式；
          const strNodepath = objFormula.strAssResolved;
          if (!strNodepath) {
            continue;
          }
          // strNodepath = strNodepath.substr(2); // 去掉前缀“$.”
          // 查找关联公式
          const lstRefFormulaAndParams = this.getInvolvedFormulas(strNodepath, formulaParams);
          // 2.5 枚举关联公式；并去掉依赖
          for (let i = 0; i < lstRefFormulaAndParams.length; i++) {
            const objRef = lstRefFormulaAndParams[i][0];
            if (objRef && objRef.id) {
              // 2.5.1 删除被枚举关联公式的依赖项（删除节点相关的出连接线）；
              const areaItem = area[objRef.id];
              if (areaItem) {
                const _strAssResolved = objFormula.strAssResolved;
                // 寻找该公式的赋值节点，用于寻找同一节点得其他赋值公式
                const _formula = this.idxAssign2Formulas[_strAssResolved];
                // 同一节点有两条赋值公式时，此保存公式数据逻辑有问题。第二条公式会被覆盖
                // 暂时默认写法是同一节点的10公式写在01或者11前面。暂不会有太大问题。
                if (Object.prototype.toString.call(_formula) == '[object Array]') {
                  let flagDel = true;
                  for (let j = 0; j < _formula.length; j++) {
                    const _formulaObj = _formula[j];
                    var _formula_id = _formulaObj ? _formulaObj.id : null;
                    if (_formula_id && area[_formula_id]) {
                      flagDel = false;
                      break;
                    }
                  }

                  if (flagDel) {
                    delete areaItem.depends[strNodepath];
                  }
                } else {
                  var _formula_id = _formula ? _formula.id : null;
                  if (_formula_id && area[_formula_id]) {
                    // 该公式已从标记区删除，标记区能找到得公式肯定是其他赋值公式
                    // 同一节点的其他赋值公式存在于标记区时，不能删除依赖关系。
                  } else {
                    delete areaItem.depends[strNodepath];
                  }
                }
              }
            } else {
              console.log(`WARNING: getInvolvedFormulas() return illegal formula: ${objRef}`);
            }
          }
        }
      } while (cnt > 0 && loop < 2000); // 3 重复执行待处理队列（并避免意外出现死循环）；
      // 4 如队列仍为空，说明存在循环依赖，异常中止；
      if (this.countProperty(area) > 0) {
        console.log(
          `!!!FAILED: cleaning4DAGsorting() failed. Total involed rules ${total},still remain ${this.countProperty(
            area,
          )}.`,
        );
      } else {
        console.log(`FormulaEngine: cleaning4DAGsorting(${total}) loop-times: ${loop}, total-detect: ${sum}.`);
      }
      return orderList; // 5 返回最终拟执行队列，将用于提交顺序执行。
    };

    /**
     * 内部方法：基于图论中的拓扑排序命题，对公式进行标记过程（也即梳理依赖有向图子图的过程）.<br />
     * @param lstFormulaAndParams 待处理公式队列：[[FormulaObj, params], [FormulaObj, params], ...]
     * @param isAloneExe 是否独立执行某类型公式标志(不执行关联公式) true=是
     */
    FormulaEngine.prototype.marking4DAGsorting = function (lstFormulaAndParams, isAloneExe) {
      // 1 初始化：初始公式清单-->标记计算区&待处理队列
      const queue = [];
      const area = {}; // 标记计算区：{formulaId1:{obj:FormulaObj, depends:{paramName1, paramName2}, params:[]}, formulaId2:{}}
      for (var i = 0; i < lstFormulaAndParams.length; i++) {
        var objFormulaAndParams = lstFormulaAndParams[i];
        var objFormula = objFormulaAndParams[0];
        var formulaParams = objFormulaAndParams[1];
        area[objFormula.id] = {
          obj: objFormula,
          depends: {},
          params: formulaParams,
        };
        queue.push([objFormula, formulaParams]);
      }
      // 2 枚举待处理队列
      while (queue.length > 0 && !isAloneExe) {
        // 2.0 取出一条处理公式
        var objFormulaAndParams = queue.shift();
        var objFormula = objFormulaAndParams[0];
        var formulaParams = objFormulaAndParams[1];
        // 2.1 枚举公式的赋值变量所涉及的关联公式；
        const strNodepath = objFormula.strAssResolved;
        if (!strNodepath) {
          if (objFormula.type.substr(1) === '1') {
            // 只有在Chrome模式下才打印warning信息
            // 后端预编译模式下java的js引擎没有引入jquery导致报错，故此处则根据try catch忽略错误
            try {
              if (!$.browser.msie && !$.browser.mozilla) {
                console.log(
                  `WARNING: [${objFormula.type}] '${objFormula.id}' Assignment not founded: ${objFormula.formula}`,
                );
              }
            } catch (e) {}
          }
          continue;
        }

        // strNodepath = strNodepath.substr(2); // 去掉前缀“$.”

        // 如果有动态行参数，则直接替换#号为具体的动态行下标  ；目标减少计算公式的执行；modify by meihu TODO此处可以不进行替换
        const temStrNodepath = this.twoDynamicReplace(formulaParams, strNodepath);
        const lstRefFormulaAndParams = this.getInvolvedFormulas(temStrNodepath, formulaParams);
        for (var i = 0; i < lstRefFormulaAndParams.length; i++) {
          // 枚举关联公式
          const objRef = lstRefFormulaAndParams[i][0];
          if (objRef && objRef.id) {
            let areaItem = area[objRef.id];
            // 2.1.1 如该关联公式不存在于标记计算区，则压入待处理队列，且关联公式放入标记计算区；
            if (!areaItem) {
              areaItem = area[objRef.id] = {
                obj: objRef,
                depends: {},
                params: lstRefFormulaAndParams[i][1],
              };
              queue.push([objRef, lstRefFormulaAndParams[i][1]]);
            } else if (!lstRefFormulaAndParams[i][1]) {
              // 如果被引用公式需要做全下标计算（即下标参数为空）
              if (areaItem.params != null) {
                // 新关联引用出来的公式，存在非动态行公式需要全覆盖计算的情况，典型情况是：
                // =>  动态行的分配比例  = 动态行的金额  / 合计金额
                // 上述情况会因为合金金额发生变动而执行全覆盖计算，那么此时动态行的行标是有害的，需要被剔除。
                // 合计求比例是动态行的每行都需要重新求比例，此时通过这句代码可以去掉动态行下标
                areaItem.params = null;

                // ybnsrzzs-分配税额[汇总纳税企业增值税分配表]=比例*总机构应税服务分配税额 当比例重新计算时，分配税额也要每行执行
                // 将分配税额的公式塞到queue中，且不带动态行下标，下次循环会去掉动态行下标
                queue.push([objRef, null]);
              }
            }
            // 2.1.2 在该关联公式上标记对当前变量的依赖；
            areaItem.depends[strNodepath] = true;
          } else {
            console.log(`WARNING: getInvolvedFormulas() return illegal formula: ${objRef}`);
          }
        } // 2.3 继续下一枚举关联公式；
      } // 3 重复执行待处理队列；
      // 4 最终得到标记计算区。
      return area;
    };

    FormulaEngine.prototype.twoDynamicReplace = function (dynamicParams, jpath) {
      // 两级动态行的时候，如外层动态行还存在其他校验，则此时是普通的动态行
      if (dynamicParams) {
        if (dynamicParams.length == 2) {
          if (jpath.indexOf('[##]') > -1) {
            jpath = jpath.replace(/\[##\]/g, `[${dynamicParams[0]}]`);
            jpath = jpath.replace(/\[#\]/g, `[${dynamicParams[1]}]`);
          } else {
            jpath = jpath.replace(/\[#\]/g, `[${dynamicParams[0]}]`);
          }
        } else {
          jpath = jpath.replace(/\[#\]/g, `[${dynamicParams[0]}]`).replace(/\[##\]/g, `[${dynamicParams[0]}]`);
        }
      }
      return jpath;
    };
    FormulaEngine.prototype.effectingControl = function (pass, targets, dynamicParams) {
      for (let i = 0; i < targets.length; i++) {
        const target = targets[i];
        let name = target.variable;
        const { control } = target;
        if (name && control) {
          if (dynamicParams && !(pass instanceof Array)) {
            name = this.twoDynamicReplace(dynamicParams, name);
          }
          if (pass instanceof Array) {
            // 如果无动态行参数,且结果为动态行。遍历，进行插入。动态行结果（#），target应该为数组。
            for (const k in pass) {
              // var tmp_name = name.replace(/\[#\]/g, "[" + k + "]");
              const tmp_name = name;
              if (!this.idxVariable2Control[tmp_name]) {
                this.idxVariable2Control[tmp_name] = {};
              }
              // 控制公式状态没有改变则不需要渲染
              if (!this.idxCurrentVariable2Control[tmp_name]) {
                this.idxCurrentVariable2Control[tmp_name] = {};
              }
              if (this.idxVariable2Control[tmp_name][control] !== pass[k]) {
                this.idxCurrentVariable2Control[tmp_name][control] = pass[k];
              }
              this.idxVariable2Control[tmp_name][control] = pass[k];
            }
          } else {
            // 非动态行或者动态行带参数情况：
            if (!this.idxVariable2Control[name]) {
              this.idxVariable2Control[name] = {};
            }
            // 控制公式状态没有改变则不需要渲染
            if (!this.idxCurrentVariable2Control[name]) {
              this.idxCurrentVariable2Control[name] = {};
            }
            if (this.idxVariable2Control[name][control] !== pass) {
              this.idxCurrentVariable2Control[name][control] = pass;
            }
            this.idxVariable2Control[name][control] = pass;
          }
        }
      }
    };

    FormulaEngine.prototype.decomposeFormulaTargets = function (objFormula) {
      if (objFormula.id == '0610010701010002967') {
        console.log('decomposeFormulaTargets');
      }
      if (
        this.rightSubstr(objFormula.type, 1) == '3' ||
        this.rightSubstr(objFormula.type, 1) == '2' ||
        objFormula.type == '02_01'
      ) {
        const strTar = objFormula.target;
        if (strTar) {
          const tars = strTar.split(';'); // Multi-target split by ';'
          for (let i = 0; i < tars.length; i++) {
            const tar = tars[i].trim();
            if (tar.length > 0) {
              const pair = tar.split(':');
              // var tarResolved = { "jpath" : pair[0], "control" : pair[1] };
              // var tmp = this.resolveExpression(pair[0]);
              // if (tmp && tmp.resolved) {
              //     tarResolved.variable = tmp; // tmp.resolved.substr(2);
              // } else {
              //     console.log("WARN: Decompose formula targets failed: " + pair[0]);
              //     objFormula.flagCompiled = false;
              // }
              // objFormula.lstTargetResolved.push(tarResolved);
              try {
                const tmpObj = this.resolveExpression(pair[0]);
                let tmpResolvedArr = tmpObj.resolved;

                // target公式解析,替换$.为空 JamsonWu 2018-08-14
                if (tmpResolvedArr) {
                  tmpResolvedArr = tmpResolvedArr.replace(/\$\./g, '');
                }

                if (tmpResolvedArr.search(/^\[(.)*\]$/) != -1) {
                  // 数组字符串
                  // tmpResolvedArr = tmpObj.resolved.split(",");
                  tmpResolvedArr = tmpResolvedArr.split(',');
                } else {
                  tmpResolvedArr = [tmpResolvedArr];
                }
                const arrLen = tmpResolvedArr.length;
                for (let j = 0; j < arrLen; j++) {
                  // var tarResolved = { "jpath" : pair[0], "control" : pair[1] };
                  const tarResolved = { jpath: tmpResolvedArr[j], control: pair[1] };
                  const tmp = {
                    flagAggregation: tmpObj.flagAggregation,
                    flagDynamicParam: tmpObj.flagDynamicParam,
                    resolved: tmpResolvedArr[j],
                  };
                  if (tmp && tmp.resolved) {
                    tarResolved.variable = tmp.resolved;
                  } else {
                    // this case will never come in.
                    // func:resolveExpression() will return a JSON object, or throw an exception.
                    console.log(`WARN: Decompose formula targets failed: ${pair[0]}`);
                    objFormula.flagCompiled = false;
                  }
                  objFormula.lstTargetResolved.push(tarResolved);
                }
              } catch (ex) {
                console.log(ex.toString());
                // do not push. ignore this pair target-item.
              }
            }
          }
        } else if (objFormula.type == '13') {
          console.log(`WARNING: Control formula's target is empty: ${objFormula.strFormula}`);
        }
      }
    };

    /**
     * PRIVATE: Execute associated verify formulas. Needs processing variable "this.procVerifyFormulas". <BR>
     * 内部方法：执行所有关联校验公式, 依赖过程变量"this.procVerifyFormulas", 结果会更新变量"this.idxVariable2NoPass".
     *
     * <pre>
     * this.idxVariable2NoPass = {
     *     jpath_1 : {
     *         formulaId_1 : FormulaObject_1
     *     }, jpath_2 : {
     *         formulaId_2 : FormulaObject_2, formulaId_3 : FormulaObject_3
     *     }
     * }
     * </pre>
     *
     * @param dynamicParams Array: Dynamic parameters' value. 数组：动态参数值.
     * @warning Currently only support one dynamic parameter. 目前仅支持一个动态参数值.
     */
    FormulaEngine.prototype.applyAssociatedFormulaVerify = function (dynamicParams) {
      const verifies = this.procVerifyFormulas;
      if (verifies) {
        for (let v = 0; v < verifies.length; v++) {
          const objFormula = verifies[v];
          let vars = [];
          // 判断是否添加了target属性，有则取target属性
          if (objFormula.lstTargetResolved && objFormula.lstTargetResolved.length > 0) {
            for (var i = 0; i < objFormula.lstTargetResolved.length; i++) {
              vars.push(objFormula.lstTargetResolved[i].variable);
            }
          } else {
            // 检验公式，默认提示公式中所有涉及的单元格（变量）
            vars = objFormula.lstVariables;
          }
          const pass = this.execNoCaculateFormula(objFormula, dynamicParams);
          if (pass instanceof Array) {
          }
          objFormula.lastVerify = pass;
          for (var i = 0; i < vars.length; i++) {
            let name = vars[i];
            if (dynamicParams) {
              name = name.replace(/\[#\]/g, `[${dynamicParams[0]}]`);
            }
            if (pass) {
              // Check relative variable and remove it.
              if (this.idxVariable2NoPass[name]) {
                delete this.idxVariable2NoPass[name][objFormula.id];
                if (!this.hasProperty(this.idxVariable2NoPass[name])) {
                  delete this.idxVariable2NoPass[name];
                }
              }
            } else {
              // Record relative variable of not passed.
              if (!this.idxVariable2NoPass[name]) {
                this.idxVariable2NoPass[name] = {};
              }
              this.idxVariable2NoPass[name][objFormula.id] = objFormula;
            }
          }
        }
      }
    };

    FormulaEngine.prototype.hasProperty =
      Object.getOwnPropertyNames && Object.getOwnPropertyNames(FormulaEngine).length
        ? function (obj) {
            return Object.getOwnPropertyNames(obj).length > 0;
          }
        : function (obj) {
            for (const i in obj)
              if (obj.hasOwnProperty(i)) {
                return true;
              }
            return false;
          };
    FormulaEngine.prototype.countProperty =
      Object.getOwnPropertyNames && Object.getOwnPropertyNames(FormulaEngine).length
        ? function (obj) {
            return Object.getOwnPropertyNames(obj).length;
          }
        : function (obj) {
            let count = 0;
            for (const i in obj)
              if (obj.hasOwnProperty(i)) {
                count++;
              }
            return count;
          };

    /**
     * PRIVATE: Execute verify or control formula. <BR>
     * 内部方法：执行校验公式.
     * @param objFormula Formula: Verify or control formula object. 公式对象：校验公式.
     * @param dynamicParams Array: Dynamic parameters' value. 数组：动态参数值.
     * @returns Formula result, should be true or false. 校验结果, 应为布尔值.
     * @warning Currently only support one dynamic parameter. 目前仅支持一个动态参数值.
     */
    FormulaEngine.prototype.execNoCaculateFormula = function (objFormula, dynamicParams) {
      if (objFormula.flagCompiled) {
        let ret;
        let { strExpResolved } = objFormula;
        if (objFormula.flagDynamicParam) {
          // TODO: Currently only support one dynamic parameter.
          if (dynamicParams) {
            strExpResolved = strExpResolved.replace(/\[#\]/g, `[${dynamicParams[0]}]`);
            ret = this.execute(null, strExpResolved);
          } else {
            // 对于重复行初始化校验，无法传递下标，故做遍历处理
            ret = this.noCalculateDynamicTraversing(null, strExpResolved, objFormula);
          }
        } else if (objFormula.flagAggregation) {
          // 该公式存在聚合操作要求
          // 重新解析表达式（因为很可能自编译后增加了动态行，所以需要重新计算）
          const tmp = this.resolveExpressionFull(objFormula.strExpression);
          strExpResolved = tmp.resolved;
          ret = this.execute(null, strExpResolved);
        } else {
          // Simple formula calculate
          ret = this.execute(null, strExpResolved);
        }
        // console.log("Verify " + ret + "<= " + objFormula.strFormula + " " + objFormula.desc);
        return ret;
      }
    };

    /**
     * 对字符串表达式中所包含的各jpath进行解析，主要是将其从短路径形式解析为全路径形式。
     */
    FormulaEngine.prototype.resolveExpressionFull = function (strExp) {
      let lastPos = 0;
      let strRet = '';
      let flagAggregation = false;
      const regJpath = /([$]([.\w]+|\[([*]|[\d]+)\])+)/g;
      do {
        const result = regJpath.exec(strExp);
        // console.log(result);
        if (result == null) {
          strRet += strExp.substr(lastPos, strExp.length - lastPos);
          break;
        }
        strRet += strExp.substr(lastPos, result.index - lastPos);
        const arrJpaths = jsonPath(formData, result[0], { resultType: 'PATH' });
        if (!arrJpaths) {
          // Added By C.Q 20170808 GEARS-3872 动态行-删除最后一行，求和公式失效报错
          // 修改方案：如果为求和公式内的节点不存在，则把该节点替换成0；
          // 例1：SUM($..sbbxxGridlb[*].sjzdmj) -> SUM(0)
          // 例2：ROUND(SUM($..qysdshznsfzjgsdsfpsbbfzjgGridlb[*].fpse)+SUM($..jwfzjgmbksmxbgridVO[*].jzhndmbsjksexj),2) -> ROUND(SUM(0)+SUM(0),2)
          // 例3：ROUND($..jwfzjgmbksmxbgridVO.jzhndmbfsjkse+SUM($..jwfzjgmbksmxbgridVO[*].jzhndmbsjksexj),2) -> ROUND($..jwfzjgmbksmxbgridVO.jzhndmbfsjkse+SUM(0),2)
          // 正则表达式符号解释:\s=匹配任何空白字符，包括空格、制表符、换页符等等。\w=匹配包括下划线的任何单词字符。等价于'[A-Za-z0-9_]'。\d=数字
          const pattern = /SUM\s*\(\s*\$\.*\w*\[([*]|[\d]+)\]\.\w+\)/g; // 匹配公式中是否含有求和表达式，如SUM($..sbbxxGridlb[*].sjzdmj)，只匹配单个节点合计情况
          var resultNode;
          let isHasReplace = false; // 是否把不存在节点替换成 0
          do {
            resultNode = pattern.exec(strExp);
            if (resultNode != null) {
              // 如果是求和公式
              const pattern2 = /\$\.*\w*\[([*]|[\d]+)\]\.\w+/; // 提取SUM内节点
              // 判断SUM内的节点是否为json对象没有的节点，存在则替换成0
              if (resultNode[0].match(pattern2)[0] == result[0]) {
                strRet += '0'; // 把空节点替换为0
                isHasReplace = true;
                continue;
              }
            }
          } while (resultNode != null);
          if (isHasReplace) {
            lastPos = regJpath.lastIndex;
            continue;
          }
          throw `Resolve expression failed: JsonPath [${result[0]}] in [${strExp}] select empty, can't resolve the full-path.`;
        } else if (arrJpaths.length > 1) {
          // confusingDetecte
          this.confusingDetecte(result[0], strExp);
        }
        for (let i = 0; i < arrJpaths.length; i++) {
          arrJpaths[i] = arrJpaths[i].replace(/\[\'/g, '.').replace(/\'\]/g, '');
        }
        if (arrJpaths.length > 1) {
          strRet += `[${arrJpaths}]`;
        } else {
          strRet += arrJpaths[0];
        }
        lastPos = regJpath.lastIndex;
      } while (regJpath.lastIndex < strExp.length);
      if (strExp.indexOf('[*]') >= 0) {
        flagAggregation = true;
      }
      return {
        resolved: strRet,
        flagAggregation,
        flagDynamicParam: strExp.indexOf('[#') > 0,
      };
    };
    FormulaEngine.prototype.confusingDetecte = function (jpath, strExp) {
      const regArray = /\[[#$\d]*\]/g;
      let posMulti = jpath.indexOf('..');
      if (posMulti >= 0) {
        posMulti += 2;
        const posDot = jpath.indexOf('.', posMulti);
        const posBracket = jpath.indexOf('[', posMulti);
        if (posDot <= 0) {
          posMulti = posBracket;
        } else if (posBracket <= 0) {
          posMulti = posDot;
        } else {
          posMulti = this.min(posDot, posBracket);
        }
        if (posMulti > 0) {
          const preJpath = jpath.substr(0, posMulti);
          const arrJpaths = jsonPath(formData, preJpath, { resultType: 'PATH' });
          if (arrJpaths.length > 1) {
            const base = arrJpaths[0];
            for (let i = 1; i < arrJpaths.length; i++) {
              if (base != arrJpaths[i]) {
                console.log(`WARN JsonPath confusing detected: JsonPath [${jpath}] in [${strExp}] has multi paths`);
                for (let k = 0; k < arrJpaths.length; k++) {
                  console.log(`--${k}: ${arrJpaths[k].replace(/\[\'/g, '.').replace(/\'\]/g, '')}`);
                }
                throw `JsonPath confusing detected! JsonPath [${jpath}] in [${strExp}] has multi paths, can't resolve the full-path.`;
              }
            }
          }
        }
      }
    };

    FormulaEngine.prototype.min = function () {
      if (arguments.length > 0) {
        const ps = arguments;
        if (ps.length > 0) {
          let min = ps[0];
          for (let i = 1; i < ps.length; i++) {
            min = min < ps[i] ? min : ps[i];
          }
          return min;
        }
      }
    };

    /**
     * 对动态下标的公式进行遍历校验，类似 $.vos[#].a = $.vos[#].b + $.others[1].s 时，枚举计算所有的 $.vos[#].b
     */
    FormulaEngine.prototype.noCalculateDynamicTraversing = function (strAssResolved, strExpResolved, objFormula) {
      // 1、寻找公式中带动态参数的第一个变量
      const vars = objFormula.lstVariables;
      let dynamic = null;
      for (var v = 0; v < vars.length; v++) {
        if (vars[v].indexOf('[#') > 0) {
          dynamic = vars[v];
          break;
        }
      }
      if (!dynamic) {
        console.log(
          `Calculate dynamic initial-formula failed, dynamic-param not founded in expression part: ${objFormula.strFormula}`,
        );
        return false;
      }
      // 2、计算动态参数变量的总数，以便进行遍历计算
      const objBase = formData;
      dynamic = dynamic.replace(/\[[#]{1,2}\]/g, '[*]');
      const tmp = jsonPath(objBase, dynamic);
      if (!tmp) {
        console.log(
          `Calculate dynamic initial-formula failed, jpath in expression part select failed: ${dynamic} @ ${objFormula.strFormula}`,
        );
        return false;
      }
      // 3、执行遍历循环计算
      const ret = [];
      // 支持二维数组
      const idx = 0;
      for (let k = 0; k < tmp.length; k++) {
        const tmp0 = tmp[k];
        if (tmp0 instanceof Array) {
          const tempRet = []; // 定义临时的内部一维数组
          for (var v = 0; v < tmp0.length; v++) {
            tempRet[v] = this.execute(strAssResolved, strExpResolved, [k, v]);
          }
          ret[k] = tempRet;
        } else {
          ret[k] = this.execute(strAssResolved, strExpResolved, [k]);
        }
      }

      return ret;
    };

    /**
     * PRIVATE: Execute formula in string, formula must be completely solved.<BR>
     * 内部方法：执行字符串，公式内容必须已完整解析且处理了动态变量.
     * @param strAssResolved String: Assignment part. 字符串：赋值部分（等号左侧）.
     * @param strExpResolved String: Expression part. 字符串：表达式部分（等号右侧）.
     * @returns Result after execution. 公式执行结果.
     */
    FormulaEngine.prototype.execute = function (strAssResolved, strExpResolved, dynamicParams) {
      if (dynamicParams) {
        // TODO: Currently only support one dynamic parameter.
        if (strAssResolved) {
          strAssResolved = strAssResolved.replace(/\[#\]/g, `[${dynamicParams[0]}]`);
          if (jsonPath(formData, strAssResolved) === false) {
            this.jpathNodeCreate(strAssResolved);
          }
        }
        strExpResolved = strExpResolved.replace(/\[#\]/g, `[${dynamicParams[0]}]`);
      }
      let strEval = strExpResolved;
      if (strAssResolved) {
        strEval = `${strAssResolved}=${strEval}`;
      }
      strEval = strEval.replace(/[$]/g, this.basename);

      // 公式执行: 这个写法不支持旧版的，如：IF(fjmqysdsjdnssbbsyyhdzsqy2015Grid.fjmqysdsjdnssbbsyyhdzsqy2015Gridlb.[#].xmmc=='',0,1)==1
      // return (new Function('with(this){return ' + strEval + '}')).call(formData);
      // console.log("Executing: " + strEval);
      return 0;
      // return eval(strEval);
    };

    FormulaEngine.prototype.rightSubstr = function (str, num) {
      if (str) {
        let pos = str.length - num;
        if (pos < 0) {
          pos = 0;
        }
        return str.substr(pos);
      }
    };

    FormulaEngine.prototype.searchAssignMark = function (exp) {
      let posEqual = exp.search(this.regAssignMark);
      if (posEqual > 0 && exp.charAt(posEqual) !== '=') posEqual++;
      return posEqual;
    };

    // For not to do initialization twice.
    FormulaEngine._inited = true;
  }
}

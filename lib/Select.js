'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactLifecyclesCompat = require('react-lifecycles-compat');

var _KeyCode = require('rc-util/lib/KeyCode');

var _KeyCode2 = _interopRequireDefault(_KeyCode);

var _toArray = require('rc-util/lib/Children/toArray');

var _toArray2 = _interopRequireDefault(_toArray);

var _classnames2 = require('classnames');

var _classnames3 = _interopRequireDefault(_classnames2);

var _rcAnimate = require('rc-animate');

var _rcAnimate2 = _interopRequireDefault(_rcAnimate);

var _componentClasses = require('component-classes');

var _componentClasses2 = _interopRequireDefault(_componentClasses);

var _rcMenu = require('rc-menu');

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _Option = require('./Option');

var _Option2 = _interopRequireDefault(_Option);

var _util = require('./util');

var _SelectTrigger = require('./SelectTrigger');

var _SelectTrigger2 = _interopRequireDefault(_SelectTrigger);

var _PropTypes = require('./PropTypes');

var _PropTypes2 = _interopRequireDefault(_PropTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var SELECT_EMPTY_VALUE_KEY = 'RC_SELECT_EMPTY_VALUE_KEY';

function noop() {}

function chaining() {
  var _this = this;

  for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  return function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    // eslint-disable-line
    // eslint-disable-line
    for (var i = 0; i < fns.length; i++) {
      if (fns[i] && typeof fns[i] === 'function') {
        fns[i].apply(_this, args);
      }
    }
  };
}

var Select = function (_React$Component) {
  (0, _inherits3['default'])(Select, _React$Component);

  function Select(props) {
    (0, _classCallCheck3['default'])(this, Select);

    var _this2 = (0, _possibleConstructorReturn3['default'])(this, (Select.__proto__ || Object.getPrototypeOf(Select)).call(this, props));

    _initialiseProps.call(_this2);

    var optionsInfo = Select.getOptionsInfoFromProps(props);
    _this2.state = {
      value: Select.getValueFromProps(props, true), // true: use default value
      inputValue: props.combobox ? Select.getInputValueForCombobox(props, optionsInfo, true // use default value
      ) : '',
      open: props.defaultOpen,
      optionsInfo: optionsInfo,
      // a flag for aviod redundant getOptionsInfoFromProps call
      skipBuildOptionsInfo: true
    };

    _this2.saveInputRef = (0, _util.saveRef)(_this2, 'inputRef');
    _this2.saveInputMirrorRef = (0, _util.saveRef)(_this2, 'inputMirrorRef');
    _this2.saveTopCtrlRef = (0, _util.saveRef)(_this2, 'topCtrlRef');
    _this2.saveSelectTriggerRef = (0, _util.saveRef)(_this2, 'selectTriggerRef');
    _this2.saveRootRef = (0, _util.saveRef)(_this2, 'rootRef');
    _this2.saveSelectionRef = (0, _util.saveRef)(_this2, 'selectionRef');
    _this2.ariaId = (0, _util.generateUUID)();
    return _this2;
  }

  (0, _createClass3['default'])(Select, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this.props.autoFocus) {
        this.focus();
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      if ((0, _util.isMultipleOrTags)(this.props)) {
        var inputNode = this.getInputDOMNode();
        var mirrorNode = this.getInputMirrorDOMNode();
        if (inputNode.value) {
          inputNode.style.width = '';
          inputNode.style.width = mirrorNode.clientWidth + 'px';
        } else {
          inputNode.style.width = '';
        }
      }
      this.forcePopupAlign();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.clearFocusTime();
      this.clearBlurTime();
      if (this.dropdownContainer) {
        _reactDom2['default'].unmountComponentAtNode(this.dropdownContainer);
        document.body.removeChild(this.dropdownContainer);
        this.dropdownContainer = null;
      }
    }

    // combobox ignore

  }, {
    key: 'focus',
    value: function focus() {
      if ((0, _util.isSingleMode)(this.props)) {
        this.selectionRef.focus();
      } else {
        this.getInputDOMNode().focus();
      }
    }
  }, {
    key: 'blur',
    value: function blur() {
      if ((0, _util.isSingleMode)(this.props)) {
        this.selectionRef.blur();
      } else {
        this.getInputDOMNode().blur();
      }
    }
  }, {
    key: 'renderArrow',
    value: function renderArrow(multiple) {
      var _props = this.props,
          showArrow = _props.showArrow,
          loading = _props.loading,
          inputIcon = _props.inputIcon,
          prefixCls = _props.prefixCls;

      if (!showArrow) {
        return null;
      }
      // if loading  have loading icon
      if (multiple && !loading) {
        return null;
      }
      var defaultIcon = loading ? _react2['default'].createElement('i', { className: prefixCls + '-arrow-loading' }) : _react2['default'].createElement('i', { className: prefixCls + '-arrow-icon' });
      return _react2['default'].createElement(
        'span',
        (0, _extends3['default'])({
          key: 'arrow',
          className: prefixCls + '-arrow',
          style: _util.UNSELECTABLE_STYLE
        }, _util.UNSELECTABLE_ATTRIBUTE, {
          onClick: this.onArrowClick
        }),
        inputIcon || defaultIcon
      );
    }
  }, {
    key: 'renderClear',
    value: function renderClear() {
      var _props2 = this.props,
          prefixCls = _props2.prefixCls,
          allowClear = _props2.allowClear,
          clearIcon = _props2.clearIcon;
      var _state = this.state,
          value = _state.value,
          inputValue = _state.inputValue;

      var clear = _react2['default'].createElement(
        'span',
        (0, _extends3['default'])({
          key: 'clear',
          className: prefixCls + '-selection__clear',
          onMouseDown: _util.preventDefaultEvent,
          style: _util.UNSELECTABLE_STYLE
        }, _util.UNSELECTABLE_ATTRIBUTE, {
          onClick: this.onClearSelection
        }),
        clearIcon || _react2['default'].createElement(
          'i',
          { className: prefixCls + '-selection__clear-icon' },
          '\xD7'
        )
      );
      if (!allowClear) {
        return null;
      }
      if ((0, _util.isCombobox)(this.props)) {
        if (inputValue) {
          return clear;
        }
        return null;
      }
      if (inputValue || value.length) {
        return clear;
      }
      return null;
    }
  }, {
    key: 'render',
    value: function render() {
      var _rootCls;

      var props = this.props;
      var multiple = (0, _util.isMultipleOrTags)(props);
      var state = this.state;
      var className = props.className,
          disabled = props.disabled,
          prefixCls = props.prefixCls;

      var ctrlNode = this.renderTopControlNode();
      var open = this.state.open;

      if (open) {
        this._options = this.renderFilterOptions();
      }
      var realOpen = this.getRealOpenState();
      var options = this._options || [];
      var dataOrAriaAttributeProps = {};
      Object.keys(props).forEach(function (key) {
        if (Object.prototype.hasOwnProperty.call(props, key) && (key.substr(0, 5) === 'data-' || key.substr(0, 5) === 'aria-' || key === 'role')) {
          dataOrAriaAttributeProps[key] = props[key];
        }
      });
      // for (const key in props) {
      //   if (
      //     Object.prototype.hasOwnProperty.call(props, key) &&
      //     (key.substr(0, 5) === 'data-' || key.substr(0, 5) === 'aria-' || key === 'role')
      //   ) {
      //     dataOrAriaAttributeProps[key] = props[key];
      //   }
      // }
      var extraSelectionProps = (0, _extends3['default'])({}, dataOrAriaAttributeProps);
      if (!(0, _util.isMultipleOrTagsOrCombobox)(props)) {
        extraSelectionProps = (0, _extends3['default'])({}, extraSelectionProps, {
          onKeyDown: this.onKeyDown,
          tabIndex: props.disabled ? -1 : props.tabIndex
        });
      }
      var rootCls = (_rootCls = {}, (0, _defineProperty3['default'])(_rootCls, className, !!className), (0, _defineProperty3['default'])(_rootCls, prefixCls, 1), (0, _defineProperty3['default'])(_rootCls, prefixCls + '-open', open), (0, _defineProperty3['default'])(_rootCls, prefixCls + '-focused', open || !!this._focused), (0, _defineProperty3['default'])(_rootCls, prefixCls + '-combobox', (0, _util.isCombobox)(props)), (0, _defineProperty3['default'])(_rootCls, prefixCls + '-disabled', disabled), (0, _defineProperty3['default'])(_rootCls, prefixCls + '-enabled', !disabled), (0, _defineProperty3['default'])(_rootCls, prefixCls + '-allow-clear', !!props.allowClear), (0, _defineProperty3['default'])(_rootCls, prefixCls + '-no-arrow', !props.showArrow), _rootCls);
      return _react2['default'].createElement(
        _SelectTrigger2['default'],
        {
          onPopupFocus: this.onPopupFocus,
          onMouseEnter: this.props.onMouseEnter,
          onMouseLeave: this.props.onMouseLeave,
          dropdownAlign: props.dropdownAlign,
          dropdownClassName: props.dropdownClassName,
          dropdownMatchSelectWidth: props.dropdownMatchSelectWidth,
          defaultActiveFirstOption: props.defaultActiveFirstOption,
          dropdownMenuStyle: props.dropdownMenuStyle,
          transitionName: props.transitionName,
          animation: props.animation,
          prefixCls: props.prefixCls,
          dropdownStyle: props.dropdownStyle,
          combobox: props.combobox,
          showSearch: props.showSearch,
          options: options,
          multiple: multiple,
          disabled: disabled,
          visible: realOpen,
          inputValue: state.inputValue,
          value: state.value,
          backfillValue: state.backfillValue,
          firstActiveValue: props.firstActiveValue,
          onDropdownVisibleChange: this.onDropdownVisibleChange,
          getPopupContainer: props.getPopupContainer,
          onMenuSelect: this.onMenuSelect,
          onMenuDeselect: this.onMenuDeselect,
          onPopupScroll: props.onPopupScroll,
          showAction: props.showAction,
          ref: this.saveSelectTriggerRef,
          menuItemSelectedIcon: props.menuItemSelectedIcon,
          dropdownRender: props.dropdownRender,
          ariaId: this.ariaId,
          popupPlacement: this.props.popupPlacement
        },
        _react2['default'].createElement(
          'div',
          {
            id: props.id,
            style: props.style,
            ref: this.saveRootRef,
            onBlur: this.onOuterBlur,
            onFocus: this.onOuterFocus,
            className: (0, _classnames3['default'])(rootCls),
            onMouseDown: this.markMouseDown,
            onMouseUp: this.markMouseLeave,
            onMouseOut: this.markMouseLeave
          },
          _react2['default'].createElement(
            'div',
            (0, _extends3['default'])({
              ref: this.saveSelectionRef,
              key: 'selection',
              className: prefixCls + '-selection\n            ' + prefixCls + '-selection--' + (multiple ? 'multiple' : 'single'),
              role: 'combobox',
              'aria-autocomplete': 'list',
              'aria-haspopup': 'true',
              'aria-controls': this.ariaId,
              'aria-expanded': realOpen
            }, extraSelectionProps),
            ctrlNode,
            this.renderClear(),
            this.renderArrow(multiple)
          )
        )
      );
    }
  }]);
  return Select;
}(_react2['default'].Component);

Select.propTypes = _PropTypes2['default'];
Select.defaultProps = {
  prefixCls: 'rc-select',
  defaultOpen: false,
  labelInValue: false,
  defaultActiveFirstOption: true,
  showSearch: true,
  allowClear: false,
  placeholder: '',
  onChange: noop,
  onFocus: noop,
  onBlur: noop,
  onSelect: noop,
  onSearch: noop,
  onDeselect: noop,
  onInputKeyDown: noop,
  showArrow: true,
  dropdownMatchSelectWidth: true,
  dropdownStyle: {},
  dropdownMenuStyle: {},
  optionFilterProp: 'value',
  optionLabelProp: 'value',
  notFoundContent: 'Not Found',
  backfill: false,
  showAction: ['click'],
  tokenSeparators: [],
  autoClearSearchValue: true,
  tabIndex: 0,
  dropdownRender: function dropdownRender(menu) {
    return menu;
  }
};

Select.getDerivedStateFromProps = function (nextProps, prevState) {
  var optionsInfo = prevState.skipBuildOptionsInfo ? prevState.optionsInfo : Select.getOptionsInfoFromProps(nextProps, prevState);

  var newState = {
    optionsInfo: optionsInfo,
    skipBuildOptionsInfo: false
  };

  if ('open' in nextProps) {
    newState.open = nextProps.open;
  }

  if ('value' in nextProps) {
    var value = Select.getValueFromProps(nextProps);
    newState.value = value;
    if (nextProps.combobox) {
      newState.inputValue = Select.getInputValueForCombobox(nextProps, optionsInfo);
    }
  }
  return newState;
};

Select.getOptionsFromChildren = function (children) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  _react2['default'].Children.forEach(children, function (child) {
    if (!child) {
      return;
    }
    if (child.type.isSelectOptGroup) {
      Select.getOptionsFromChildren(child.props.children, options);
    } else {
      options.push(child);
    }
  });
  return options;
};

Select.getInputValueForCombobox = function (props, optionsInfo, useDefaultValue) {
  var value = [];
  if ('value' in props && !useDefaultValue) {
    value = (0, _util.toArray)(props.value);
  }
  if ('defaultValue' in props && useDefaultValue) {
    value = (0, _util.toArray)(props.defaultValue);
  }
  if (value.length) {
    value = value[0];
  } else {
    return '';
  }
  var label = value;
  if (props.labelInValue) {
    label = value.label;
  } else if (optionsInfo[(0, _util.getMapKey)(value)]) {
    label = optionsInfo[(0, _util.getMapKey)(value)].label;
  }
  if (label === undefined) {
    label = '';
  }
  return label;
};

Select.getLabelFromOption = function (props, option) {
  return (0, _util.getPropValue)(option, props.optionLabelProp);
};

Select.getOptionsInfoFromProps = function (props, preState) {
  var options = Select.getOptionsFromChildren(props.children);
  var optionsInfo = {};
  options.forEach(function (option) {
    var singleValue = (0, _util.getValuePropValue)(option);
    optionsInfo[(0, _util.getMapKey)(singleValue)] = {
      option: option,
      value: singleValue,
      label: Select.getLabelFromOption(props, option),
      title: option.props.title
    };
  });
  if (preState) {
    // keep option info in pre state value.
    var oldOptionsInfo = preState.optionsInfo;
    var value = preState.value;
    value.forEach(function (v) {
      var key = (0, _util.getMapKey)(v);
      if (!optionsInfo[key] && oldOptionsInfo[key] !== undefined) {
        optionsInfo[key] = oldOptionsInfo[key];
      }
    });
  }
  return optionsInfo;
};

Select.getValueFromProps = function (props, useDefaultValue) {
  var value = [];
  if ('value' in props && !useDefaultValue) {
    value = (0, _util.toArray)(props.value);
  }
  if ('defaultValue' in props && useDefaultValue) {
    value = (0, _util.toArray)(props.defaultValue);
  }
  if (props.labelInValue) {
    value = value.map(function (v) {
      return v.key;
    });
  }
  return value;
};

var _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this.onInputChange = function (event) {
    var tokenSeparators = _this3.props.tokenSeparators;

    var val = event.target.value;
    if ((0, _util.isMultipleOrTags)(_this3.props) && tokenSeparators.length && (0, _util.includesSeparators)(val, tokenSeparators)) {
      var nextValue = _this3.getValueByInput(val);
      if (nextValue !== undefined) {
        _this3.fireChange(nextValue);
      }
      _this3.setOpenState(false, true);
      _this3.setInputValue('', false);
      return;
    }
    _this3.setInputValue(val);
    _this3.setState({
      open: true
    });
    if ((0, _util.isCombobox)(_this3.props)) {
      _this3.fireChange([val]);
    }
  };

  this.onDropdownVisibleChange = function (open) {
    if (open && !_this3._focused) {
      _this3.clearBlurTime();
      _this3.timeoutFocus();
      _this3._focused = true;
      _this3.updateFocusClassName();
    }
    _this3.setOpenState(open);
  };

  this.onKeyDown = function (event) {
    var open = _this3.state.open;
    var disabled = _this3.props.disabled;

    if (disabled) {
      return;
    }
    var keyCode = event.keyCode;
    if (open && !_this3.getInputDOMNode()) {
      _this3.onInputKeyDown(event);
    } else if (keyCode === _KeyCode2['default'].ENTER || keyCode === _KeyCode2['default'].DOWN) {
      if (!open) _this3.setOpenState(true);
      event.preventDefault();
    } else if (keyCode === _KeyCode2['default'].SPACE) {
      // Not block space if popup is shown
      if (!open) {
        _this3.setOpenState(true);
        event.preventDefault();
      }
    }
  };

  this.onInputKeyDown = function (event) {
    var props = _this3.props;
    if (props.disabled) {
      return;
    }
    var state = _this3.state;
    var keyCode = event.keyCode;
    if ((0, _util.isMultipleOrTags)(props) && !event.target.value && keyCode === _KeyCode2['default'].BACKSPACE) {
      event.preventDefault();
      var value = state.value;

      if (value.length) {
        _this3.removeSelected(value[value.length - 1]);
      }
      return;
    }
    if (keyCode === _KeyCode2['default'].DOWN) {
      if (!state.open) {
        _this3.openIfHasChildren();
        event.preventDefault();
        event.stopPropagation();
        return;
      }
    } else if (keyCode === _KeyCode2['default'].ENTER && state.open) {
      // Aviod trigger form submit when select item
      // https://github.com/ant-design/ant-design/issues/10861
      event.preventDefault();
    } else if (keyCode === _KeyCode2['default'].ESC) {
      if (state.open) {
        _this3.setOpenState(false);
        event.preventDefault();
        event.stopPropagation();
      }
      return;
    }

    if (_this3.getRealOpenState(state)) {
      var menu = _this3.selectTriggerRef.getInnerMenu();
      if (menu && menu.onKeyDown(event, _this3.handleBackfill)) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
  };

  this.onMenuSelect = function (_ref) {
    var item = _ref.item;

    if (!item) {
      return;
    }

    var value = _this3.state.value;
    var props = _this3.props;
    var selectedValue = (0, _util.getValuePropValue)(item);
    var lastValue = value[value.length - 1];
    _this3.fireSelect(selectedValue);
    if ((0, _util.isMultipleOrTags)(props)) {
      if ((0, _util.findIndexInValueBySingleValue)(value, selectedValue) !== -1) {
        return;
      }
      value = value.concat([selectedValue]);
    } else {
      if (lastValue !== undefined && lastValue === selectedValue && selectedValue !== _this3.state.backfillValue) {
        _this3.setOpenState(false, true);
        return;
      }
      value = [selectedValue];
      _this3.setOpenState(false, true);
    }
    _this3.fireChange(value);
    var inputValue = void 0;
    if ((0, _util.isCombobox)(props)) {
      inputValue = (0, _util.getPropValue)(item, props.optionLabelProp);
    } else {
      inputValue = '';
    }
    if (props.autoClearSearchValue) {
      _this3.setInputValue(inputValue, false);
    }
  };

  this.onMenuDeselect = function (_ref2) {
    var item = _ref2.item,
        domEvent = _ref2.domEvent;

    if (domEvent.type === 'keydown' && domEvent.keyCode === _KeyCode2['default'].ENTER) {
      _this3.removeSelected((0, _util.getValuePropValue)(item));
      return;
    }
    if (domEvent.type === 'click') {
      _this3.removeSelected((0, _util.getValuePropValue)(item));
    }
    var props = _this3.props;

    if (props.autoClearSearchValue) {
      _this3.setInputValue('', false);
    }
  };

  this.onArrowClick = function (e) {
    e.stopPropagation();
    e.preventDefault();
    if (!_this3.props.disabled) {
      _this3.setOpenState(!_this3.state.open, !_this3.state.open);
    }
  };

  this.onPlaceholderClick = function () {
    if (_this3.getInputDOMNode()) {
      _this3.getInputDOMNode().focus();
    }
  };

  this.onOuterFocus = function (e) {
    if (_this3.props.disabled) {
      e.preventDefault();
      return;
    }
    _this3.clearBlurTime();
    if (!(0, _util.isMultipleOrTagsOrCombobox)(_this3.props) && e.target === _this3.getInputDOMNode()) {
      return;
    }
    if (_this3._focused) {
      return;
    }
    _this3._focused = true;
    _this3.updateFocusClassName();
    // only effect multiple or tag mode
    if (!(0, _util.isMultipleOrTags)(_this3.props) || !_this3._mouseDown) {
      _this3.timeoutFocus();
    }
  };

  this.onPopupFocus = function () {
    // fix ie scrollbar, focus element again
    _this3.maybeFocus(true, true);
  };

  this.onOuterBlur = function (e) {
    if (_this3.props.disabled) {
      e.preventDefault();
      return;
    }
    _this3.blurTimer = setTimeout(function () {
      _this3._focused = false;
      _this3.updateFocusClassName();
      var props = _this3.props;
      var value = _this3.state.value;
      var inputValue = _this3.state.inputValue;

      if ((0, _util.isSingleMode)(props) && props.showSearch && inputValue && props.defaultActiveFirstOption) {
        var options = _this3._options || [];
        if (options.length) {
          var firstOption = (0, _util.findFirstMenuItem)(options);
          if (firstOption) {
            value = [(0, _util.getValuePropValue)(firstOption)];
            _this3.fireChange(value);
          }
        }
      } else if ((0, _util.isMultipleOrTags)(props) && inputValue) {
        if (_this3._mouseDown) {
          // need update dropmenu when not blur
          _this3.setInputValue('');
        } else {
          // why not use setState?
          _this3.state.inputValue = '';
          _this3.getInputDOMNode().value = '';
        }

        var tmpValue = _this3.getValueByInput(inputValue);
        if (tmpValue !== undefined) {
          value = tmpValue;
          _this3.fireChange(value);
        }
      }

      // if click the rest space of Select in multiple mode
      if ((0, _util.isMultipleOrTags)(props) && _this3._mouseDown) {
        _this3.maybeFocus(true, true);
        _this3._mouseDown = false;
        return;
      }
      _this3.setOpenState(false);
      props.onBlur(_this3.getVLForOnChange(value));
    }, 10);
  };

  this.onClearSelection = function (event) {
    var props = _this3.props;
    var state = _this3.state;
    if (props.disabled) {
      return;
    }
    var inputValue = state.inputValue,
        value = state.value;

    event.stopPropagation();
    if (inputValue || value.length) {
      if (value.length) {
        _this3.fireChange([]);
      }
      _this3.setOpenState(false, true);
      if (inputValue) {
        _this3.setInputValue('');
      }
    }
  };

  this.onChoiceAnimationLeave = function () {
    _this3.forcePopupAlign();
  };

  this.getOptionInfoBySingleValue = function (value, optionsInfo) {
    var info = void 0;
    optionsInfo = optionsInfo || _this3.state.optionsInfo;
    if (optionsInfo[(0, _util.getMapKey)(value)]) {
      info = optionsInfo[(0, _util.getMapKey)(value)];
    }
    if (info) {
      return info;
    }
    var defaultLabel = value;
    if (_this3.props.labelInValue) {
      var label = (0, _util.getLabelFromPropsValue)(_this3.props.value, value);
      if (label !== undefined) {
        defaultLabel = label;
      }
    }
    var defaultInfo = {
      option: _react2['default'].createElement(
        _Option2['default'],
        { value: value, key: value },
        value
      ),
      value: value,
      label: defaultLabel
    };
    return defaultInfo;
  };

  this.getOptionBySingleValue = function (value) {
    var _getOptionInfoBySingl = _this3.getOptionInfoBySingleValue(value),
        option = _getOptionInfoBySingl.option;

    return option;
  };

  this.getOptionsBySingleValue = function (values) {
    return values.map(function (value) {
      return _this3.getOptionBySingleValue(value);
    });
  };

  this.getValueByLabel = function (label) {
    if (label === undefined) {
      return null;
    }
    var value = null;
    Object.keys(_this3.state.optionsInfo).forEach(function (key) {
      var info = _this3.state.optionsInfo[key];
      if ((0, _util.toArray)(info.label).join('') === label) {
        value = info.value;
      }
    });
    return value;
  };

  this.getVLBySingleValue = function (value) {
    if (_this3.props.labelInValue) {
      return {
        key: value,
        label: _this3.getLabelBySingleValue(value)
      };
    }
    return value;
  };

  this.getVLForOnChange = function (vls_) {
    var vls = vls_;
    if (vls !== undefined) {
      if (!_this3.props.labelInValue) {
        vls = vls.map(function (v) {
          return v;
        });
      } else {
        vls = vls.map(function (vl) {
          return {
            key: vl,
            label: _this3.getLabelBySingleValue(vl)
          };
        });
      }
      return (0, _util.isMultipleOrTags)(_this3.props) ? vls : vls[0];
    }
    return vls;
  };

  this.getLabelBySingleValue = function (value, optionsInfo) {
    var _getOptionInfoBySingl2 = _this3.getOptionInfoBySingleValue(value, optionsInfo),
        label = _getOptionInfoBySingl2.label;

    return label;
  };

  this.getDropdownContainer = function () {
    if (!_this3.dropdownContainer) {
      _this3.dropdownContainer = document.createElement('div');
      document.body.appendChild(_this3.dropdownContainer);
    }
    return _this3.dropdownContainer;
  };

  this.getPlaceholderElement = function () {
    var props = _this3.props,
        state = _this3.state;

    var hidden = false;
    if (state.inputValue) {
      hidden = true;
    }
    if (state.value.length) {
      hidden = true;
    }
    if ((0, _util.isCombobox)(props) && state.value.length === 1 && !state.value[0]) {
      hidden = false;
    }
    var placeholder = props.placeholder;
    if (placeholder) {
      return _react2['default'].createElement(
        'div',
        (0, _extends3['default'])({
          onMouseDown: _util.preventDefaultEvent,
          style: (0, _extends3['default'])({
            display: hidden ? 'none' : 'block'
          }, _util.UNSELECTABLE_STYLE)
        }, _util.UNSELECTABLE_ATTRIBUTE, {
          onClick: _this3.onPlaceholderClick,
          className: props.prefixCls + '-selection__placeholder'
        }),
        placeholder
      );
    }
    return null;
  };

  this.getInputElement = function () {
    var props = _this3.props;
    var inputElement = props.getInputElement ? props.getInputElement() : _react2['default'].createElement('input', { id: props.id, autoComplete: 'off' });
    var inputCls = (0, _classnames3['default'])(inputElement.props.className, (0, _defineProperty3['default'])({}, props.prefixCls + '-search__field', true));
    // https://github.com/ant-design/ant-design/issues/4992#issuecomment-281542159
    // Add space to the end of the inputValue as the width measurement tolerance
    return _react2['default'].createElement(
      'div',
      { className: props.prefixCls + '-search__field__wrap' },
      _react2['default'].cloneElement(inputElement, {
        ref: _this3.saveInputRef,
        onChange: _this3.onInputChange,
        onKeyDown: chaining(_this3.onInputKeyDown, inputElement.props.onKeyDown, _this3.props.onInputKeyDown),
        value: _this3.state.inputValue,
        disabled: props.disabled,
        className: inputCls
      }),
      _react2['default'].createElement(
        'span',
        { ref: _this3.saveInputMirrorRef, className: props.prefixCls + '-search__field__mirror' },
        _this3.state.inputValue,
        '\xA0'
      )
    );
  };

  this.getInputDOMNode = function () {
    return _this3.topCtrlRef ? _this3.topCtrlRef.querySelector('input,textarea,div[contentEditable]') : _this3.inputRef;
  };

  this.getInputMirrorDOMNode = function () {
    return _this3.inputMirrorRef;
  };

  this.getPopupDOMNode = function () {
    return _this3.selectTriggerRef.getPopupDOMNode();
  };

  this.getPopupMenuComponent = function () {
    return _this3.selectTriggerRef.getInnerMenu();
  };

  this.setOpenState = function (open, needFocus) {
    var props = _this3.props,
        state = _this3.state;

    if (state.open === open) {
      _this3.maybeFocus(open, needFocus);
      return;
    }

    if (_this3.props.onDropdownVisibleChange) {
      _this3.props.onDropdownVisibleChange(open);
    }

    var nextState = {
      open: open,
      backfillValue: undefined
    };
    // clear search input value when open is false in singleMode.
    if (!open && (0, _util.isSingleMode)(props) && props.showSearch) {
      _this3.setInputValue('', false);
    }
    if (!open) {
      _this3.maybeFocus(open, needFocus);
    }
    _this3.setState(nextState, function () {
      if (open) {
        _this3.maybeFocus(open, needFocus);
      }
    });
  };

  this.setInputValue = function (inputValue) {
    var fireSearch = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    if (inputValue !== _this3.state.inputValue) {
      _this3.setState({
        inputValue: inputValue
      }, _this3.forcePopupAlign);
      if (fireSearch) {
        _this3.props.onSearch(inputValue);
      }
    }
  };

  this.getValueByInput = function (string) {
    var _props3 = _this3.props,
        multiple = _props3.multiple,
        tokenSeparators = _props3.tokenSeparators;

    var nextValue = _this3.state.value;
    var hasNewValue = false;
    (0, _util.splitBySeparators)(string, tokenSeparators).forEach(function (label) {
      var selectedValue = [label];
      if (multiple) {
        var value = _this3.getValueByLabel(label);
        if (value && (0, _util.findIndexInValueBySingleValue)(nextValue, value) === -1) {
          nextValue = nextValue.concat(value);
          hasNewValue = true;
          _this3.fireSelect(value);
        }
      } else if ((0, _util.findIndexInValueBySingleValue)(nextValue, label) === -1) {
        nextValue = nextValue.concat(selectedValue);
        hasNewValue = true;
        _this3.fireSelect(label);
      }
    });
    return hasNewValue ? nextValue : undefined;
  };

  this.getRealOpenState = function (state) {
    var _open = _this3.props.open;

    if (typeof _open === 'boolean') {
      return _open;
    }
    var open = (state || _this3.state).open;
    var options = _this3._options || [];
    if ((0, _util.isMultipleOrTagsOrCombobox)(_this3.props) || !_this3.props.showSearch) {
      if (open && !options.length) {
        open = false;
      }
    }
    return open;
  };

  this.markMouseDown = function () {
    _this3._mouseDown = true;
  };

  this.markMouseLeave = function () {
    _this3._mouseDown = false;
  };

  this.handleBackfill = function (item) {
    if (!_this3.props.backfill || !((0, _util.isSingleMode)(_this3.props) || (0, _util.isCombobox)(_this3.props))) {
      return;
    }

    var key = (0, _util.getValuePropValue)(item);

    if ((0, _util.isCombobox)(_this3.props)) {
      _this3.setInputValue(key, false);
    }

    _this3.setState({
      value: [key],
      backfillValue: key
    });
  };

  this.filterOption = function (input, child) {
    var defaultFilter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _util.defaultFilterFn;
    var value = _this3.state.value;

    var lastValue = value[value.length - 1];
    if (!input || lastValue && lastValue === _this3.state.backfillValue) {
      return true;
    }
    var filterFn = _this3.props.filterOption;
    if ('filterOption' in _this3.props) {
      if (_this3.props.filterOption === true) {
        filterFn = defaultFilter;
      }
    } else {
      filterFn = defaultFilter;
    }

    if (!filterFn) {
      return true;
    } else if (typeof filterFn === 'function') {
      return filterFn.call(_this3, input, child);
    } else if (child.props.disabled) {
      return false;
    }
    return true;
  };

  this.timeoutFocus = function () {
    if (_this3.focusTimer) {
      _this3.clearFocusTime();
    }
    _this3.focusTimer = setTimeout(function () {
      _this3.props.onFocus();
    }, 10);
  };

  this.clearFocusTime = function () {
    if (_this3.focusTimer) {
      clearTimeout(_this3.focusTimer);
      _this3.focusTimer = null;
    }
  };

  this.clearBlurTime = function () {
    if (_this3.blurTimer) {
      clearTimeout(_this3.blurTimer);
      _this3.blurTimer = null;
    }
  };

  this.updateFocusClassName = function () {
    var rootRef = _this3.rootRef,
        props = _this3.props;
    // avoid setState and its side effect

    if (_this3._focused) {
      (0, _componentClasses2['default'])(rootRef).add(props.prefixCls + '-focused');
    } else {
      (0, _componentClasses2['default'])(rootRef).remove(props.prefixCls + '-focused');
    }
  };

  this.maybeFocus = function (open, needFocus) {
    if (needFocus || open) {
      var input = _this3.getInputDOMNode();
      var _document = document,
          activeElement = _document.activeElement;

      if (input && (open || (0, _util.isMultipleOrTagsOrCombobox)(_this3.props))) {
        if (activeElement !== input) {
          input.focus();
          _this3._focused = true;
        }
      } else if (activeElement !== _this3.selectionRef) {
        _this3.selectionRef.focus();
        _this3._focused = true;
      }
    }
  };

  this.removeSelected = function (selectedKey, e) {
    var props = _this3.props;
    if (props.disabled || _this3.isChildDisabled(selectedKey)) {
      return;
    }

    // Do not trigger Trigger popup
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }

    var value = _this3.state.value.filter(function (singleValue) {
      return singleValue !== selectedKey;
    });
    var canMultiple = (0, _util.isMultipleOrTags)(props);

    if (canMultiple) {
      var event = selectedKey;
      if (props.labelInValue) {
        event = {
          key: selectedKey,
          label: _this3.getLabelBySingleValue(selectedKey)
        };
      }
      props.onDeselect(event, _this3.getOptionBySingleValue(selectedKey));
    }
    _this3.fireChange(value);
  };

  this.openIfHasChildren = function () {
    var props = _this3.props;
    if (_react2['default'].Children.count(props.children) || (0, _util.isSingleMode)(props)) {
      _this3.setOpenState(true);
    }
  };

  this.fireSelect = function (value) {
    _this3.props.onSelect(_this3.getVLBySingleValue(value), _this3.getOptionBySingleValue(value));
  };

  this.fireChange = function (value) {
    var props = _this3.props;
    if (!('value' in props)) {
      _this3.setState({
        value: value
      }, _this3.forcePopupAlign);
    }
    var vls = _this3.getVLForOnChange(value);
    var options = _this3.getOptionsBySingleValue(value);
    props.onChange(vls, (0, _util.isMultipleOrTags)(_this3.props) ? options : options[0]);
  };

  this.isChildDisabled = function (key) {
    return (0, _toArray2['default'])(_this3.props.children).some(function (child) {
      var childValue = (0, _util.getValuePropValue)(child);
      return childValue === key && child.props && child.props.disabled;
    });
  };

  this.forcePopupAlign = function () {
    if (!_this3.state.open) {
      return;
    }
    _this3.selectTriggerRef.triggerRef.forcePopupAlign();
  };

  this.renderFilterOptions = function () {
    var inputValue = _this3.state.inputValue;
    var _props4 = _this3.props,
        children = _props4.children,
        tags = _props4.tags,
        filterOption = _props4.filterOption,
        notFoundContent = _props4.notFoundContent;

    var menuItems = [];
    var childrenKeys = [];
    var options = _this3.renderFilterOptionsFromChildren(children, childrenKeys, menuItems);
    if (tags) {
      // tags value must be string
      var value = _this3.state.value;
      value = value.filter(function (singleValue) {
        return childrenKeys.indexOf(singleValue) === -1 && (!inputValue || String(singleValue).indexOf(String(inputValue)) > -1);
      });
      value.forEach(function (singleValue) {
        var key = singleValue;
        var menuItem = _react2['default'].createElement(
          _rcMenu.Item,
          {
            style: _util.UNSELECTABLE_STYLE,
            role: 'option',
            attribute: _util.UNSELECTABLE_ATTRIBUTE,
            value: key,
            key: key
          },
          key
        );
        options.push(menuItem);
        menuItems.push(menuItem);
      });
      if (inputValue) {
        var notFindInputItem = menuItems.every(function (option) {
          // this.filterOption return true has two meaning,
          // 1, some one exists after filtering
          // 2, filterOption is set to false
          // condition 2 does not mean the option has same value with inputValue
          var filterFn = function filterFn() {
            return (0, _util.getValuePropValue)(option) === inputValue;
          };
          if (filterOption !== false) {
            return !_this3.filterOption.call(_this3, inputValue, option, filterFn);
          }
          return !filterFn();
        });
        if (notFindInputItem) {
          options.unshift(_react2['default'].createElement(
            _rcMenu.Item,
            {
              style: _util.UNSELECTABLE_STYLE,
              role: 'option',
              attribute: _util.UNSELECTABLE_ATTRIBUTE,
              value: inputValue,
              key: inputValue
            },
            inputValue
          ));
        }
      }
    }

    if (!options.length && notFoundContent) {
      options = [_react2['default'].createElement(
        _rcMenu.Item,
        {
          style: _util.UNSELECTABLE_STYLE,
          attribute: _util.UNSELECTABLE_ATTRIBUTE,
          disabled: true,
          role: 'option',
          value: 'NOT_FOUND',
          key: 'NOT_FOUND'
        },
        notFoundContent
      )];
    }
    return options;
  };

  this.renderFilterOptionsFromChildren = function (children, childrenKeys, menuItems) {
    var sel = [];
    var props = _this3.props;
    var inputValue = _this3.state.inputValue;

    var tags = props.tags;
    _react2['default'].Children.forEach(children, function (child) {
      if (!child) {
        return;
      }
      if (child.type.isSelectOptGroup) {
        var label = child.props.label;
        var key = child.key;
        if (!key && typeof label === 'string') {
          key = label;
        } else if (!label && key) {
          label = key;
        }

        // Match option group label
        if (inputValue && _this3.filterOption(inputValue, child)) {
          var innerItems = (0, _toArray2['default'])(child.props.children).map(function (subChild) {
            var childValue = (0, _util.getValuePropValue)(subChild) || subChild.key;
            return _react2['default'].createElement(_rcMenu.Item, (0, _extends3['default'])({ key: childValue, value: childValue }, subChild.props));
          });

          sel.push(_react2['default'].createElement(
            _rcMenu.ItemGroup,
            { key: key, title: label },
            innerItems
          ));

          // Not match
        } else {
          var _innerItems = _this3.renderFilterOptionsFromChildren(child.props.children, childrenKeys, menuItems);
          if (_innerItems.length) {
            sel.push(_react2['default'].createElement(
              _rcMenu.ItemGroup,
              { key: key, title: label },
              _innerItems
            ));
          }
        }

        return;
      }

      (0, _warning2['default'])(child.type.isSelectOption, 'the children of `Select` should be `Select.Option` or `Select.OptGroup`, ' + ('instead of `' + (child.type.name || child.type.displayName || child.type) + '`.'));

      var childValue = (0, _util.getValuePropValue)(child);

      (0, _util.validateOptionValue)(childValue, _this3.props);

      if (_this3.filterOption(inputValue, child)) {
        var menuItem = _react2['default'].createElement(_rcMenu.Item, (0, _extends3['default'])({
          style: _util.UNSELECTABLE_STYLE,
          attribute: _util.UNSELECTABLE_ATTRIBUTE,
          value: childValue,
          key: childValue,
          role: 'option'
        }, child.props));
        sel.push(menuItem);
        menuItems.push(menuItem);
      }

      if (tags) {
        childrenKeys.push(childValue);
      }
    });

    return sel;
  };

  this.renderTopControlNode = function () {
    var _state2 = _this3.state,
        value = _state2.value,
        open = _state2.open,
        inputValue = _state2.inputValue;

    var props = _this3.props;
    var choiceTransitionName = props.choiceTransitionName,
        prefixCls = props.prefixCls,
        maxTagTextLength = props.maxTagTextLength,
        maxTagCount = props.maxTagCount,
        maxTagPlaceholder = props.maxTagPlaceholder,
        showSearch = props.showSearch,
        removeIcon = props.removeIcon;

    var className = prefixCls + '-selection__rendered';
    // search input is inside topControlNode in single, multiple & combobox. 2016/04/13
    var innerNode = null;
    if ((0, _util.isSingleMode)(props)) {
      var selectedValue = null;
      if (value.length) {
        var showSelectedValue = false;
        var opacity = 1;
        if (!showSearch) {
          showSelectedValue = true;
        } else if (open) {
          showSelectedValue = !inputValue;
          if (showSelectedValue) {
            opacity = 0.4;
          }
        } else {
          showSelectedValue = true;
        }
        var singleValue = value[0];

        var _getOptionInfoBySingl3 = _this3.getOptionInfoBySingleValue(singleValue),
            label = _getOptionInfoBySingl3.label,
            title = _getOptionInfoBySingl3.title;

        selectedValue = _react2['default'].createElement(
          'div',
          {
            key: 'value',
            className: prefixCls + '-selection-selected-value',
            title: (0, _util.toTitle)(title || label),
            style: {
              display: showSelectedValue ? 'block' : 'none',
              opacity: opacity
            }
          },
          label
        );
      }
      if (!showSearch) {
        innerNode = [selectedValue];
      } else {
        innerNode = [selectedValue, _react2['default'].createElement(
          'div',
          {
            className: prefixCls + '-search ' + prefixCls + '-search--inline',
            key: 'input',
            style: {
              display: open ? 'block' : 'none'
            }
          },
          _this3.getInputElement()
        )];
      }
    } else {
      var selectedValueNodes = [];
      var limitedCountValue = value;
      var maxTagPlaceholderEl = void 0;
      if (maxTagCount !== undefined && value.length > maxTagCount) {
        limitedCountValue = limitedCountValue.slice(0, maxTagCount);
        var omittedValues = _this3.getVLForOnChange(value.slice(maxTagCount, value.length));
        var content = '+ ' + (value.length - maxTagCount) + ' ...';
        if (maxTagPlaceholder) {
          content = typeof maxTagPlaceholder === 'function' ? maxTagPlaceholder(omittedValues) : maxTagPlaceholder;
        }
        maxTagPlaceholderEl = _react2['default'].createElement(
          'li',
          (0, _extends3['default'])({
            style: _util.UNSELECTABLE_STYLE
          }, _util.UNSELECTABLE_ATTRIBUTE, {
            role: 'presentation',
            onMouseDown: _util.preventDefaultEvent,
            className: prefixCls + '-selection__choice ' + prefixCls + '-selection__choice__disabled',
            key: 'maxTagPlaceholder',
            title: (0, _util.toTitle)(content)
          }),
          _react2['default'].createElement(
            'div',
            { className: prefixCls + '-selection__choice__content' },
            content
          )
        );
      }
      if ((0, _util.isMultipleOrTags)(props)) {
        selectedValueNodes = limitedCountValue.map(function (singleValue) {
          var info = _this3.getOptionInfoBySingleValue(singleValue);
          var content = info.label;
          var title = info.title || content;
          if (maxTagTextLength && typeof content === 'string' && content.length > maxTagTextLength) {
            content = content.slice(0, maxTagTextLength) + '...';
          }
          var disabled = _this3.isChildDisabled(singleValue);
          var choiceClassName = disabled ? prefixCls + '-selection__choice ' + prefixCls + '-selection__choice__disabled' : prefixCls + '-selection__choice';
          return _react2['default'].createElement(
            'li',
            (0, _extends3['default'])({
              style: _util.UNSELECTABLE_STYLE
            }, _util.UNSELECTABLE_ATTRIBUTE, {
              onMouseDown: _util.preventDefaultEvent,
              className: choiceClassName,
              role: 'presentation',
              key: singleValue || SELECT_EMPTY_VALUE_KEY,
              title: (0, _util.toTitle)(title)
            }),
            _react2['default'].createElement(
              'div',
              { className: prefixCls + '-selection__choice__content' },
              content
            ),
            disabled ? null : _react2['default'].createElement(
              'span',
              {
                onClick: function onClick(event) {
                  _this3.removeSelected(singleValue, event);
                },
                className: prefixCls + '-selection__choice__remove'
              },
              removeIcon || _react2['default'].createElement(
                'i',
                { className: prefixCls + '-selection__choice__remove-icon' },
                '\xD7'
              )
            )
          );
        });
      }
      if (maxTagPlaceholderEl) {
        selectedValueNodes.push(maxTagPlaceholderEl);
      }
      selectedValueNodes.push(_react2['default'].createElement(
        'li',
        { className: prefixCls + '-search ' + prefixCls + '-search--inline', key: '__input' },
        _this3.getInputElement()
      ));

      if ((0, _util.isMultipleOrTags)(props) && choiceTransitionName) {
        innerNode = _react2['default'].createElement(
          _rcAnimate2['default'],
          {
            onLeave: _this3.onChoiceAnimationLeave,
            component: 'ul',
            transitionName: choiceTransitionName
          },
          selectedValueNodes
        );
      } else {
        innerNode = _react2['default'].createElement(
          'ul',
          null,
          selectedValueNodes
        );
      }
    }
    return _react2['default'].createElement(
      'div',
      { className: className, ref: _this3.saveTopCtrlRef },
      _this3.getPlaceholderElement(),
      innerNode
    );
  };
};

Select.displayName = 'Select';

(0, _reactLifecyclesCompat.polyfill)(Select);

exports['default'] = Select;
module.exports = exports['default'];
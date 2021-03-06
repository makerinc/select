import _extends from 'babel-runtime/helpers/extends';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import Trigger from 'rc-trigger';
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ReactDOM from 'react-dom';
import { isSingleMode, saveRef } from './util';
import DropdownMenu from './DropdownMenu';

Trigger.displayName = 'Trigger';

var autoAdjustOverflow = {
  adjustX: 1,
  adjustY: 1
};

var BUILT_IN_PLACEMENTS = {
  bottomLeft: {
    points: ['tl', 'bl'],
    offset: [0, 4],
    overflow: {
      adjustX: 0,
      adjustY: 1
    }
  },
  topLeft: {
    points: ['bl', 'tl'],
    offset: [0, -4],
    overflow: {
      adjustX: 0,
      adjustY: 1
    }
  },
  topCenter: {
    points: ['bc', 'tc'],
    overflow: autoAdjustOverflow,
    offset: [0, -4]
  },
  topRight: {
    points: ['br', 'tr'],
    overflow: autoAdjustOverflow,
    offset: [0, -4]
  },
  bottomCenter: {
    points: ['tc', 'bc'],
    overflow: autoAdjustOverflow,
    offset: [0, 4]
  },
  bottomRight: {
    points: ['tr', 'br'],
    overflow: autoAdjustOverflow,
    offset: [0, 4]
  }
};

var SelectTrigger = function (_React$Component) {
  _inherits(SelectTrigger, _React$Component);

  function SelectTrigger(props) {
    _classCallCheck(this, SelectTrigger);

    var _this = _possibleConstructorReturn(this, (SelectTrigger.__proto__ || Object.getPrototypeOf(SelectTrigger)).call(this, props));

    _initialiseProps.call(_this);

    _this.saveDropdownMenuRef = saveRef(_this, 'dropdownMenuRef');
    _this.saveTriggerRef = saveRef(_this, 'triggerRef');

    _this.state = {
      dropdownWidth: null
    };
    return _this;
  }

  _createClass(SelectTrigger, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.setDropdownWidth();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.setDropdownWidth();
    }
  }, {
    key: 'render',
    value: function render() {
      var _popupClassName;

      var _props = this.props,
          onPopupFocus = _props.onPopupFocus,
          props = _objectWithoutProperties(_props, ['onPopupFocus']);

      var multiple = props.multiple,
          visible = props.visible,
          inputValue = props.inputValue,
          dropdownAlign = props.dropdownAlign,
          disabled = props.disabled,
          showSearch = props.showSearch,
          dropdownClassName = props.dropdownClassName,
          dropdownStyle = props.dropdownStyle,
          dropdownMatchSelectWidth = props.dropdownMatchSelectWidth;

      var dropdownPrefixCls = this.getDropdownPrefixCls();
      var popupClassName = (_popupClassName = {}, _defineProperty(_popupClassName, dropdownClassName, !!dropdownClassName), _defineProperty(_popupClassName, dropdownPrefixCls + '--' + (multiple ? 'multiple' : 'single'), 1), _popupClassName);
      var popupElement = this.getDropdownElement({
        menuItems: props.options,
        onPopupFocus: onPopupFocus,
        multiple: multiple,
        inputValue: inputValue,
        visible: visible
      });
      var hideAction = void 0;
      if (disabled) {
        hideAction = [];
      } else if (isSingleMode(props) && !showSearch) {
        hideAction = ['click'];
      } else {
        hideAction = ['blur'];
      }
      var popupStyle = _extends({}, dropdownStyle);
      var widthProp = dropdownMatchSelectWidth ? 'width' : 'minWidth';
      if (this.state.dropdownWidth) {
        popupStyle[widthProp] = this.state.dropdownWidth + 'px';
      }
      return React.createElement(
        Trigger,
        _extends({}, props, {
          showAction: disabled ? [] : this.props.showAction,
          hideAction: hideAction,
          ref: this.saveTriggerRef,
          popupPlacement: this.props.popupPlacement || 'bottomLeft',
          builtinPlacements: BUILT_IN_PLACEMENTS,
          prefixCls: dropdownPrefixCls,
          popupTransitionName: this.getDropdownTransitionName(),
          onPopupVisibleChange: props.onDropdownVisibleChange,
          popup: popupElement,
          popupAlign: dropdownAlign,
          popupVisible: visible,
          getPopupContainer: props.getPopupContainer,
          popupClassName: classnames(popupClassName),
          popupStyle: popupStyle
        }),
        props.children
      );
    }
  }]);

  return SelectTrigger;
}(React.Component);

SelectTrigger.propTypes = {
  onPopupFocus: PropTypes.func,
  onPopupScroll: PropTypes.func,
  dropdownMatchSelectWidth: PropTypes.bool,
  dropdownAlign: PropTypes.object,
  visible: PropTypes.bool,
  disabled: PropTypes.bool,
  showSearch: PropTypes.bool,
  dropdownClassName: PropTypes.string,
  multiple: PropTypes.bool,
  inputValue: PropTypes.string,
  filterOption: PropTypes.any,
  options: PropTypes.any,
  prefixCls: PropTypes.string,
  popupClassName: PropTypes.string,
  children: PropTypes.any,
  showAction: PropTypes.arrayOf(PropTypes.string),
  menuItemSelectedIcon: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  dropdownRender: PropTypes.func,
  ariaId: PropTypes.string
};
SelectTrigger.defaultProps = {
  dropdownRender: function dropdownRender(menu) {
    return menu;
  }
};

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.setDropdownWidth = function () {
    var width = ReactDOM.findDOMNode(_this2).offsetWidth;
    if (width !== _this2.state.dropdownWidth) {
      _this2.setState({ dropdownWidth: width });
    }
  };

  this.getInnerMenu = function () {
    return _this2.dropdownMenuRef && _this2.dropdownMenuRef.menuRef;
  };

  this.getPopupDOMNode = function () {
    return _this2.triggerRef.getPopupDomNode();
  };

  this.getDropdownElement = function (newProps) {
    var props = _this2.props;

    var dropdownRender = props.dropdownRender,
        ariaId = props.ariaId;


    var menuNode = React.createElement(DropdownMenu, _extends({
      ref: _this2.saveDropdownMenuRef
    }, newProps, {
      ariaId: ariaId,
      prefixCls: _this2.getDropdownPrefixCls(),
      onMenuSelect: props.onMenuSelect,
      onMenuDeselect: props.onMenuDeselect,
      onPopupScroll: props.onPopupScroll,
      value: props.value,
      backfillValue: props.backfillValue,
      firstActiveValue: props.firstActiveValue,
      defaultActiveFirstOption: props.defaultActiveFirstOption,
      dropdownMenuStyle: props.dropdownMenuStyle,
      menuItemSelectedIcon: props.menuItemSelectedIcon
    }));

    return dropdownRender(menuNode, props);
  };

  this.getDropdownTransitionName = function () {
    var props = _this2.props;
    var transitionName = props.transitionName;
    if (!transitionName && props.animation) {
      transitionName = _this2.getDropdownPrefixCls() + '-' + props.animation;
    }
    return transitionName;
  };

  this.getDropdownPrefixCls = function () {
    return _this2.props.prefixCls + '-dropdown';
  };
};

export default SelectTrigger;


SelectTrigger.displayName = 'SelectTrigger';
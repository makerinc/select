import Trigger from 'rc-trigger';
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ReactDOM from 'react-dom';
import { isSingleMode, saveRef } from './util';
import DropdownMenu from './DropdownMenu';

Trigger.displayName = 'Trigger';

const autoAdjustOverflow = {
  adjustX: 1,
  adjustY: 1,
};

const BUILT_IN_PLACEMENTS = {
  bottomLeft: {
    points: ['tl', 'bl'],
    offset: [0, 4],
    overflow: {
      adjustX: 0,
      adjustY: 1,
    },
  },
  topLeft: {
    points: ['bl', 'tl'],
    offset: [0, -4],
    overflow: {
      adjustX: 0,
      adjustY: 1,
    },
  },
  topCenter: {
    points: ['bc', 'tc'],
    overflow: autoAdjustOverflow,
    offset: [0, -4],
  },
  topRight: {
    points: ['br', 'tr'],
    overflow: autoAdjustOverflow,
    offset: [0, -4],
  },
  bottomCenter: {
    points: ['tc', 'bc'],
    overflow: autoAdjustOverflow,
    offset: [0, 4],
  },
  bottomRight: {
    points: ['tr', 'br'],
    overflow: autoAdjustOverflow,
    offset: [0, 4],
  },
};

export default class SelectTrigger extends React.Component {
  static propTypes = {
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
    ariaId: PropTypes.string,
  };

  static defaultProps = {
    dropdownRender: menu => menu,
  };

  constructor(props) {
    super(props);

    this.saveDropdownMenuRef = saveRef(this, 'dropdownMenuRef');
    this.saveTriggerRef = saveRef(this, 'triggerRef');

    this.state = {
      dropdownWidth: null,
    };
  }

  componentDidMount() {
    this.setDropdownWidth();
  }

  componentDidUpdate() {
    this.setDropdownWidth();
  }

  setDropdownWidth = () => {
    const width = ReactDOM.findDOMNode(this).offsetWidth;
    if (width !== this.state.dropdownWidth) {
      this.setState({ dropdownWidth: width });
    }
  };

  getInnerMenu = () => {
    return this.dropdownMenuRef && this.dropdownMenuRef.menuRef;
  };

  getPopupDOMNode = () => {
    return this.triggerRef.getPopupDomNode();
  };

  getDropdownElement = newProps => {
    const props = this.props;

    const { dropdownRender, ariaId } = props;

    const menuNode = (
      <DropdownMenu
        ref={this.saveDropdownMenuRef}
        {...newProps}
        ariaId={ariaId}
        prefixCls={this.getDropdownPrefixCls()}
        onMenuSelect={props.onMenuSelect}
        onMenuDeselect={props.onMenuDeselect}
        onPopupScroll={props.onPopupScroll}
        value={props.value}
        backfillValue={props.backfillValue}
        firstActiveValue={props.firstActiveValue}
        defaultActiveFirstOption={props.defaultActiveFirstOption}
        dropdownMenuStyle={props.dropdownMenuStyle}
        menuItemSelectedIcon={props.menuItemSelectedIcon}
      />
    );

    return dropdownRender(menuNode, props);
  };

  getDropdownTransitionName = () => {
    const props = this.props;
    let transitionName = props.transitionName;
    if (!transitionName && props.animation) {
      transitionName = `${this.getDropdownPrefixCls()}-${props.animation}`;
    }
    return transitionName;
  };

  getDropdownPrefixCls = () => {
    return `${this.props.prefixCls}-dropdown`;
  };

  render() {
    const { onPopupFocus, ...props } = this.props;
    const {
      multiple,
      visible,
      inputValue,
      dropdownAlign,
      disabled,
      showSearch,
      dropdownClassName,
      dropdownStyle,
      dropdownMatchSelectWidth,
    } = props;
    const dropdownPrefixCls = this.getDropdownPrefixCls();
    const popupClassName = {
      [dropdownClassName]: !!dropdownClassName,
      [`${dropdownPrefixCls}--${multiple ? 'multiple' : 'single'}`]: 1,
    };
    const popupElement = this.getDropdownElement({
      menuItems: props.options,
      onPopupFocus,
      multiple,
      inputValue,
      visible,
    });
    let hideAction;
    if (disabled) {
      hideAction = [];
    } else if (isSingleMode(props) && !showSearch) {
      hideAction = ['click'];
    } else {
      hideAction = ['blur'];
    }
    const popupStyle = { ...dropdownStyle };
    const widthProp = dropdownMatchSelectWidth ? 'width' : 'minWidth';
    if (this.state.dropdownWidth) {
      popupStyle[widthProp] = `${this.state.dropdownWidth}px`;
    }
    return (
      <Trigger
        {...props}
        showAction={disabled ? [] : this.props.showAction}
        hideAction={hideAction}
        ref={this.saveTriggerRef}
        popupPlacement={this.props.popupPlacement || 'bottomLeft'}
        builtinPlacements={BUILT_IN_PLACEMENTS}
        prefixCls={dropdownPrefixCls}
        popupTransitionName={this.getDropdownTransitionName()}
        onPopupVisibleChange={props.onDropdownVisibleChange}
        popup={popupElement}
        popupAlign={dropdownAlign}
        popupVisible={visible}
        getPopupContainer={props.getPopupContainer}
        popupClassName={classnames(popupClassName)}
        popupStyle={popupStyle}
      >
        {props.children}
      </Trigger>
    );
  }
}

SelectTrigger.displayName = 'SelectTrigger';

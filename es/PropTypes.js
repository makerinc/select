import PropTypes from 'prop-types';

function valueType(props, propName, componentName) {
  var basicType = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);

  var labelInValueShape = PropTypes.shape({
    key: basicType.isRequired,
    label: PropTypes.node
  });

  for (var _len = arguments.length, rest = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    rest[_key - 3] = arguments[_key];
  }

  if (props.labelInValue) {
    var validate = PropTypes.oneOfType([PropTypes.arrayOf(labelInValueShape), labelInValueShape]);
    var error = validate.apply(undefined, [props, propName, componentName].concat(rest));
    if (error) {
      return new Error('Invalid prop `' + propName + '` supplied to `' + componentName + '`, ' + ('when you set `labelInValue` to `true`, `' + propName + '` should in ') + 'shape of `{ key: string | number, label?: ReactNode }`.');
    }
  } else if ((props.mode === 'multiple' || props.mode === 'tags' || props.multiple || props.tags) && props[propName] === '') {
    return new Error('Invalid prop `' + propName + '` of type `string` supplied to `' + componentName + '`, ' + 'expected `array` when `multiple` or `tags` is `true`.');
  } else {
    var _validate = PropTypes.oneOfType([PropTypes.arrayOf(basicType), basicType]);
    return _validate.apply(undefined, [props, propName, componentName].concat(rest));
  }
  return null;
}

var SelectPropTypes = {
  id: PropTypes.string,
  defaultActiveFirstOption: PropTypes.bool,
  multiple: PropTypes.bool,
  filterOption: PropTypes.any,
  children: PropTypes.any,
  showSearch: PropTypes.bool,
  disabled: PropTypes.bool,
  allowClear: PropTypes.bool,
  showArrow: PropTypes.bool,
  tags: PropTypes.bool,
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  transitionName: PropTypes.string,
  optionLabelProp: PropTypes.string,
  optionFilterProp: PropTypes.string,
  animation: PropTypes.string,
  choiceTransitionName: PropTypes.string,
  open: PropTypes.bool,
  defaultOpen: PropTypes.bool,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onSelect: PropTypes.func,
  onSearch: PropTypes.func,
  onPopupScroll: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onInputKeyDown: PropTypes.func,
  placeholder: PropTypes.any,
  onDeselect: PropTypes.func,
  labelInValue: PropTypes.bool,
  loading: PropTypes.bool,
  value: valueType,
  defaultValue: valueType,
  dropdownStyle: PropTypes.object,
  maxTagTextLength: PropTypes.number,
  maxTagCount: PropTypes.number,
  maxTagPlaceholder: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  tokenSeparators: PropTypes.arrayOf(PropTypes.string),
  getInputElement: PropTypes.func,
  showAction: PropTypes.arrayOf(PropTypes.string),
  clearIcon: PropTypes.node,
  inputIcon: PropTypes.node,
  removeIcon: PropTypes.node,
  menuItemSelectedIcon: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  dropdownRender: PropTypes.func
};

export default SelectPropTypes;
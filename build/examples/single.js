webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(3);


/***/ },
/* 1 */,
/* 2 */,
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var React = __webpack_require__(5);
	var Select = __webpack_require__(6);
	var Option = Select.Option;
	__webpack_require__(9);
	__webpack_require__(7);
	function handleChange(value) {
	  console.log('selected ' + value);
	}

	var c1 = (
	  React.createElement("div", null, 
	    React.createElement("h1", null, "Single Select"), 
	    React.createElement("div", {style: {width: 300}}, 
	      React.createElement(Select, {value: "lucy", className: "forTest", onChange: handleChange}, 
	        React.createElement(Option, {value: "jack", className: "forTest"}, 
	          React.createElement("b", {style: {
	            color: 'red'
	          }}, "jack")
	        ), 
	        React.createElement(Option, {value: "lucy"}, "lucy"), 
	        React.createElement(Option, {value: "disabled", disabled: true}, "disabled"), 
	        React.createElement(Option, {value: "yiminghe"}, "yiminghe")
	      )
	    )
	  )
	);

	React.render(c1, document.getElementById('__react-content'));


/***/ }
]);
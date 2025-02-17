var margin = 20,
		padding = 2,
		diameter = 650,
		root;
    var selectedYear = 1970;
    d3.json("data/extract_data_regions_cp.php?year="+selectedYear, function(error, data){
        if (error) throw error;
        flareData(data);
    });

/*********************************************************************/

function flareData(data) {
  root = data;

  var color = d3.scale.linear()
  		.domain([0, depthCount(root)])
  		.range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
  		.interpolate(d3.interpolateHcl);

  var pack = d3.layout.pack()
  		.padding(padding)
  		.size([diameter, diameter])
  		.value(function(d) {
  				//return d.size;
  			return 100;
  		}),
  		arc = d3.svg.arc().innerRadius(0),
  		pie = d3.layout.pie;

  var svg = d3.select("svg")

  		.append("g")
  		.attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

  var focus = root,
  		nodes = pack.nodes(root),
  		//nodes = svg.selectAll("g.node")
  		//.data(pack.nodes(root)),
  		view;

  var circle = svg.selectAll("circle")
  		.data(nodes)
  		.enter().append("circle")
  		.attr("class", function(d) {
  				return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root";
  		})
  		.style("fill", function(d) {
  				return d.children ? color(d.depth) : null;
  		})
  		.on("click", function(d) {
  				if (focus !== d) zoom(d), d3.event.stopPropagation();
  		});

  /*
  nodes.enter()
  		.append("g")
  		.attr("class", "node")
  		.attr("transform", function(d) {
  				return "translate(" + d.x + "," + d.y + ")";
  		});

  var arcGs = nodes.selectAll("g.arc")
  		.data(function(d) {
  				return pie(d[1]).map(function(m) {
  						m.r = d.r;
  						return m;
  				});
  		});
  var arcEnter = arcGs.enter().append("g").attr("class", "arc");

  arcEnter.append("path")
  		.attr("d", function(d) {
  				arc.outerRadius(d.r);
  				return arc(d);
  		})
  		.style("fill", function(d, i) {
  				return color(i);
  		});
  */
  /*---------------------------------------------------------------*/

  var text = svg.selectAll("text")
  		.data(nodes)
  		.enter().append("text")
  		.attr("class", "label")
  		.style("fill-opacity", function(d) {
  				return d.parent === root ? 1 : 0;
  		})
  		.style("display", function(d) {
  				return d.parent === root ? null : "none";
  		})
  		.text(function(d) {
  				return d.name;
  		});

  var node = svg.selectAll("circle,text");
  console.log(node);

  d3.select("body")
  		.on("click", function() {
  				zoom(root);
  		});

  zoomTo([root.x, root.y, root.r * 2 + margin]);

  function zoom(d) {
  		var focus0 = focus;
  		focus = d;

  		var transition = d3.transition()
  				.duration(d3.event.altKey ? 7500 : 750)
  				.tween("zoom", function(d) {
  						var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
  						return function(t) {
  								zoomTo(i(t));
  						};
  				});

  		transition.selectAll("text")
  				.filter(function(d) {
  						return d.parent === focus || this.style.display === "inline";
  				})
  				.style("fill-opacity", function(d) {
  						return d.parent === focus ? 1 : 0;
  				})
  				.each("start", function(d) {
  						if (d.parent === focus) this.style.display = "inline";
  				})
  				.each("end", function(d) {
  						if (d.parent !== focus) this.style.display = "none";
  				});
  }

  function zoomTo(v) {
  		var k = diameter / v[2];
  		view = v;
  		node.attr("transform", function(d) {
  				return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")";
  		});
  		circle.attr("r", function(d) {
  				return d.r * k;
  		});
  }

  /**
   * Counts JSON graph depth
   * @param {object} branch
   * @return {Number} object graph depth
   */
  function depthCount(branch) {
  		if (!branch.children) {
  				return 1;
  		}
  		return 1 + d3.max(branch.children.map(depthCount));
  }

  d3.select(self.frameElement).style("height", diameter + "px");

/*

		return {
				"name": "flare",
				"children": [{
						"name": "analytics",
						"children": [{
								"name": "cluster",
								"children": [{
										"name": "AgglomerativeCluster",
										"size": 39
								}, {
										"name": "CommunityStructure",
										"size": 38
								}, {
										"name": "HierarchicalCluster",
										"size": 67
								}, {
										"name": "MergeEdge",
										"size": 74
								}]
						}, {
								"name": "graph",
								"children": [{
										"name": "BetweennessCentrality",
										"size": 35
								}, {
										"name": "LinkDistance",
										"size": 57
								}, {
										"name": "MaxFlowMinCut",
										"size": 78
								}, {
										"name": "ShortestPaths",
										"size": 59
								}, {
										"name": "SpanningTree",
										"size": 34
								}]
						}, {
								"name": "optimization",
								"children": [{
										"name": "AspectRatioBanker",
										"size": 70
								}]
						}]
				}, {
						"name": "animate",
						"children": [{
								"name": "Easing",
								"size": 17
						}, {
								"name": "FunctionSequence",
								"size": 58
						}, {
								"name": "interpolate",
								"children": [{
										"name": "ArrayInterpolator",
										"size": 19
								}, {
										"name": "ColorInterpolator",
										"size": 20
								}, {
										"name": "DateInterpolator",
										"size": 13
								}, {
										"name": "Interpolator",
										"size": 87
								}, {
										"name": "MatrixInterpolator",
										"size": 22
								}, {
										"name": "NumberInterpolator",
										"size": 13
								}, {
										"name": "ObjectInterpolator",
										"size": 16
								}, {
										"name": "PointInterpolator",
										"size": 16
								}, {
										"name": "RectangleInterpolator",
										"size": 20
								}]
						}, {
								"name": "ISchedulable",
								"size": 10
						}, {
								"name": "Parallel",
								"size": 51
						}, {
								"name": "Pause",
								"size": 44
						}, {
								"name": "Scheduler",
								"size": 55
						}, {
								"name": "Sequence",
								"size": 55
						}, {
								"name": "Transition",
								"size": 92
						}, {
								"name": "Transitioner",
								"size": 19
						}, {
								"name": "TransitionEvent",
								"size": 11
						}, {
								"name": "Tween",
								"size": 60
						}]
				}, {
						"name": "data",
						"children": [{
								"name": "converters",
								"children": [{
										"name": "Converters",
										"size": 72
								}, {
										"name": "DelimitedTextConverter",
										"size": 42
								}, {
										"name": "GraphMLConverter",
										"size": 98
								}, {
										"name": "IDataConverter",
										"size": 13
								}, {
										"name": "JSONConverter",
										"size": 22
								}]
						}, {
								"name": "DataField",
								"size": 17
						}, {
								"name": "DataSchema",
								"size": 21
						}, {
								"name": "DataSet",
								"size": 58
						}, {
								"name": "DataSource",
								"size": 33
						}, {
								"name": "DataTable",
								"size": 77
						}, {
								"name": "DataUtil",
								"size": 33
						}]
				}, {
						"name": "display",
						"children": [{
								"name": "DirtySprite",
								"size": 88
						}, {
								"name": "LineSprite",
								"size": 17
						}, {
								"name": "RectSprite",
								"size": 36
						}, {
								"name": "TextSprite",
								"size": 10
						}]
				}, {
						"name": "flex",
						"children": [{
								"name": "FlareVis",
								"size": 41
						}]
				}, {
						"name": "physics",
						"children": [{
								"name": "DragForce",
								"size": 10
						}, {
								"name": "GravityForce",
								"size": 13
						}, {
								"name": "IForce",
								"size": 31
						}, {
								"name": "NBodyForce",
								"size": 10
						}, {
								"name": "Particle",
								"size": 28
						}, {
								"name": "Simulation",
								"size": 99
						}, {
								"name": "Spring",
								"size": 22
						}, {
								"name": "SpringForce",
								"size": 16
						}]
				}, {
						"name": "query",
						"children": [{
								"name": "AggregateExpression",
								"size": 16
						}, {
								"name": "And",
								"size": 10
						}, {
								"name": "Arithmetic",
								"size": 38
						}, {
								"name": "Average",
								"size": 89
						}, {
								"name": "BinaryExpression",
								"size": 28
						}, {
								"name": "Comparison",
								"size": 51
						}, {
								"name": "CompositeExpression",
								"size": 36
						}, {
								"name": "Count",
								"size": 78
						}, {
								"name": "DateUtil",
								"size": 41
						}, {
								"name": "Distinct",
								"size": 93
						}, {
								"name": "Expression",
								"size": 51
						}, {
								"name": "ExpressionIterator",
								"size": 36
						}, {
								"name": "Fn",
								"size": 32
						}, {
								"name": "If",
								"size": 27
						}, {
								"name": "IsA",
								"size": 20
						}, {
								"name": "Literal",
								"size": 12
						}, {
								"name": "Match",
								"size": 37
						}, {
								"name": "Maximum",
								"size": 84
						}, {
								"name": "methods",
								"children": [{
										"name": "add",
										"size": 59
								}, {
										"name": "and",
										"size": 33
								}, {
										"name": "average",
										"size": 28
								}, {
										"name": "count",
										"size": 27
								}, {
										"name": "distinct",
										"size": 29
								}, {
										"name": "div",
										"size": 59
								}, {
										"name": "eq",
										"size": 59
								}, {
										"name": "fn",
										"size": 46
								}, {
										"name": "gt",
										"size": 60
								}, {
										"name": "gte",
										"size": 62
								}, {
										"name": "iff",
										"size": 74
								}, {
										"name": "isa",
										"size": 46
								}, {
										"name": "lt",
										"size": 59
								}, {
										"name": "lte",
										"size": 61
								}, {
										"name": "max",
										"size": 28
								}, {
										"name": "min",
										"size": 28
								}, {
										"name": "mod",
										"size": 59
								}, {
										"name": "mul",
										"size": 60
								}, {
										"name": "neq",
										"size": 59
								}, {
										"name": "not",
										"size": 38
								}, {
										"name": "or",
										"size": 32
								}, {
										"name": "orderby",
										"size": 30
								}, {
										"name": "range",
										"size": 77
								}, {
										"name": "select",
										"size": 29
								}, {
										"name": "stddev",
										"size": 36
								}, {
										"name": "sub",
										"size": 60
								}, {
										"name": "sum",
										"size": 28
								}, {
										"name": "update",
										"size": 30
								}, {
										"name": "variance",
										"size": 33
								}, {
										"name": "where",
										"size": 29
								}, {
										"name": "xor",
										"size": 35
								}, {
										"name": "_",
										"size": 264
								}]
						}, {
								"name": "Minimum",
								"size": 84
						}, {
								"name": "Not",
								"size": 15
						}, {
								"name": "Or",
								"size": 97
						}, {
								"name": "Query",
								"size": 13
						}, {
								"name": "Range",
								"size": 15
						}, {
								"name": "StringUtil",
								"size": 41
						}, {
								"name": "Sum",
								"size": 79
						}, {
								"name": "Variable",
								"size": 11
						}, {
								"name": "Variance",
								"size": 18
						}, {
								"name": "Xor",
								"size": 11
						}]
				}, {
						"name": "scale",
						"children": [{
								"name": "IScaleMap",
								"size": 21
						}, {
								"name": "LinearScale",
								"size": 13
						}, {
								"name": "LogScale",
								"size": 31
						}, {
								"name": "OrdinalScale",
								"size": 37
						}, {
								"name": "QuantileScale",
								"size": 24
						}, {
								"name": "QuantitativeScale",
								"size": 48
						}, {
								"name": "RootScale",
								"size": 17
						}, {
								"name": "Scale",
								"size": 42
						}, {
								"name": "ScaleType",
								"size": 18
						}, {
								"name": "TimeScale",
								"size": 58
						}]
				}, {
						"name": "util",
						"children": [{
								"name": "Arrays",
								"size": 82
						}, {
								"name": "Colors",
								"size": 10
						}, {
								"name": "Dates",
								"size": 82
						}, {
								"name": "Displays",
								"size": 12
						}, {
								"name": "Filter",
								"size": 23
						}, {
								"name": "Geometry",
								"size": 10
						}, {
								"name": "heap",
								"children": [{
										"name": "FibonacciHeap",
										"size": 93
								}, {
										"name": "HeapNode",
										"size": 12
								}]
						}, {
								"name": "IEvaluable",
								"size": 33
						}, {
								"name": "IPredicate",
								"size": 38
						}, {
								"name": "IValueProxy",
								"size": 87
						}, {
								"name": "math",
								"children": [{
										"name": "DenseMatrix",
										"size": 31
								}, {
										"name": "IMatrix",
										"size": 28
								}, {
										"name": "SparseMatrix",
										"size": 33
								}]
						}, {
								"name": "Maths",
								"size": 17
						}, {
								"name": "Orientation",
								"size": 14
						}, {
								"name": "palette",
								"children": [{
										"name": "ColorPalette",
										"size": 63
								}, {
										"name": "Palette",
										"size": 12
								}, {
										"name": "ShapePalette",
										"size": 20
								}, {
										"name": "SizePalette",
										"size": 22
								}]
						}, {
								"name": "Property",
								"size": 55
						}, {
								"name": "Shapes",
								"size": 19
						}, {
								"name": "Sort",
								"size": 68
						}, {
								"name": "Stats",
								"size": 65
						}, {
								"name": "Strings",
								"size": 22
						}]
				}, {
						"name": "vis",
						"children": [{
								"name": "axis",
								"children": [{
										"name": "Axes",
										"size": 13
								}, {
										"name": "Axis",
										"size": 24
								}, {
										"name": "AxisGridLine",
										"size": 65
								}, {
										"name": "AxisLabel",
										"size": 63
								}, {
										"name": "CartesianAxes",
										"size": 67
								}]
						}, {
								"name": "controls",
								"children": [{
										"name": "AnchorControl",
										"size": 21
								}, {
										"name": "ClickControl",
										"size": 38
								}, {
										"name": "Control",
										"size": 13
								}, {
										"name": "ControlList",
										"size": 46
								}, {
										"name": "DragControl",
										"size": 26
								}, {
										"name": "ExpandControl",
										"size": 28
								}, {
										"name": "HoverControl",
										"size": 48
								}, {
										"name": "IControl",
										"size": 76
								}, {
										"name": "PanZoomControl",
										"size": 52
								}, {
										"name": "SelectionControl",
										"size": 78
								}, {
										"name": "TooltipControl",
										"size": 84
								}]
						}, {
								"name": "data",
								"children": [{
										"name": "Data",
										"size": 20
								}, {
										"name": "DataList",
										"size": 19
								}, {
										"name": "DataSprite",
										"size": 10
								}, {
										"name": "EdgeSprite",
										"size": 33
								}, {
										"name": "NodeSprite",
										"size": 19
								}, {
										"name": "render",
										"children": [{
												"name": "ArrowType",
												"size": 69
										}, {
												"name": "EdgeRenderer",
												"size": 55
										}, {
												"name": "IRenderer",
												"size": 35
										}, {
												"name": "ShapeRenderer",
												"size": 22
										}]
								}, {
										"name": "ScaleBinding",
										"size": 11
								}, {
										"name": "Tree",
										"size": 71
								}, {
										"name": "TreeBuilder",
										"size": 99
								}]
						}, {
								"name": "events",
								"children": [{
										"name": "DataEvent",
										"size": 23
								}, {
										"name": "SelectionEvent",
										"size": 18
								}, {
										"name": "TooltipEvent",
										"size": 17
								}, {
										"name": "VisualizationEvent",
										"size": 11
								}]
						}, {
								"name": "legend",
								"children": [{
										"name": "Legend",
										"size": 20
								}, {
										"name": "LegendItem",
										"size": 46
								}, {
										"name": "LegendRange",
										"size": 10
								}]
						}, {
								"name": "operator",
								"children": [{
										"name": "distortion",
										"children": [{
												"name": "BifocalDistortion",
												"size": 44
										}, {
												"name": "Distortion",
												"size": 63
										}, {
												"name": "FisheyeDistortion",
												"size": 34
										}]
								}, {
										"name": "encoder",
										"children": [{
												"name": "ColorEncoder",
												"size": 31
										}, {
												"name": "Encoder",
												"size": 40
										}, {
												"name": "PropertyEncoder",
												"size": 41
										}, {
												"name": "ShapeEncoder",
												"size": 16
										}, {
												"name": "SizeEncoder",
												"size": 18
										}]
								}, {
										"name": "filter",
										"children": [{
												"name": "FisheyeTreeFilter",
												"size": 52
										}, {
												"name": "GraphDistanceFilter",
												"size": 31
										}, {
												"name": "VisibilityFilter",
												"size": 35
										}]
								}, {
										"name": "IOperator",
										"size": 12
								}, {
										"name": "label",
										"children": [{
												"name": "Labeler",
												"size": 99
										}, {
												"name": "RadialLabeler",
												"size": 38
										}, {
												"name": "StackedAreaLabeler",
												"size": 32
										}]
								}, {
										"name": "layout",
										"children": [{
												"name": "AxisLayout",
												"size": 67
										}, {
												"name": "BundledEdgeRouter",
												"size": 37
										}, {
												"name": "CircleLayout",
												"size": 93
										}, {
												"name": "CirclePackingLayout",
												"size": 12
										}, {
												"name": "DendrogramLayout",
												"size": 48
										}, {
												"name": "ForceDirectedLayout",
												"size": 84
										}, {
												"name": "IcicleTreeLayout",
												"size": 48
										}, {
												"name": "IndentedTreeLayout",
												"size": 31
										}, {
												"name": "Layout",
												"size": 78
										}, {
												"name": "NodeLinkTreeLayout",
												"size": 12
										}, {
												"name": "PieLayout",
												"size": 27
										}, {
												"name": "RadialTreeLayout",
												"size": 12
										}, {
												"name": "RandomLayout",
												"size": 87
										}, {
												"name": "StackedAreaLayout",
												"size": 91
										}, {
												"name": "TreeMapLayout",
												"size": 91
										}]
								}, {
										"name": "Operator",
										"size": 24
								}, {
										"name": "OperatorList",
										"size": 52
								}, {
										"name": "OperatorSequence",
										"size": 41
								}, {
										"name": "OperatorSwitch",
										"size": 25
								}, {
										"name": "SortOperator",
										"size": 20
								}]
						}, {
								"name": "Visualization",
								"size": 16
						}]
				}]
		}
    */
}

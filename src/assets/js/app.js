graphRendererFunction = function (container, statemachineid, stateflowimageurl) {
  // Checks if the browser is supported
  if (!mxClient.isBrowserSupported()) {
    // Displays an error message if the browser is not supported.
    mxUtils.error('Browser is not supported!', 200, false);
  }
  else {
    mxConstants.SHADOWCOLOR = '#e0e0e0';

    // Creates the graph inside the given container
    var graph = createGraph(container);
    var url = stateflowimageurl + statemachineid;

    jQuery(document).ready(function ($) {
      $.ajax({
        url: url,
        success: function (data) {
          var doc = mxUtils.parseXml(data);
          var codec = new mxCodec(doc);
          codec.decode(doc.documentElement, graph.getModel());
        }
      });
    });


  }

  // Creates a button to invoke the refresh function
  /*document.body.appendChild(mxUtils.button('Update', function(evt)
  {
    // XML is normally fetched from URL at server using mxUtils.get - this is a client-side
    // string with randomized states to demonstrate the idea of the workflow monitor
    var xml = '<process><update id="ApproveClaim" state="'+getState()+'"/><update id="AuthorizeClaim" state="'+getState()+'"/>'+
      '<update id="CheckAccountingData" state="'+getState()+'"/><update id="ReviewClaim" state="'+getState()+'"/>'+
      '<update id="ApproveReviewedClaim" state="'+getState()+'"/><update id="EnterAccountingData" state="'+getState()+'"/></process>';
    update(graph, xml);
  }));*/
};

/**
 * Updates the display of the given graph using the XML data
 */
function update(graph, xml) {
  if (xml != null && xml.length > 0) {
    var doc = mxUtils.parseXml(xml);

    if (doc != null && doc.documentElement != null) {
      var model = graph.getModel();
      var nodes = doc.documentElement.getElementsByTagName('update');

      if (nodes != null && nodes.length > 0) {
        model.beginUpdate();

        try {
          for (var i = 0; i < nodes.length; i++) {
            // Processes the activity nodes inside the process node
            var id = nodes[i].getAttribute('id');
            var state = nodes[i].getAttribute('state');

            // Gets the cell for the given activity name from the model
            var cell = model.getCell(id);

            // Updates the cell color and adds some tooltip information
            if (cell != null) {
              // Resets the fillcolor and the overlay
              graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, '#E3E3E3', [cell]);
              graph.removeCellOverlays(cell);

              // Changes the cell color for the known states
              if (state == 'Running') {
                graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, '#f8cecc', [cell]);
              }
              else if (state == 'Waiting') {
                graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, '#fff2cc', [cell]);
              }
              else if (state == 'Completed') {
                graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, '#d4e1f5', [cell]);
              }

              // Adds tooltip information using an overlay icon
              if (state != 'Init') {
                // Sets the overlay for the cell in the graph
                graph.addCellOverlay(cell, createOverlay(graph.warningImage, 'State: ' + state));
              }
            }
          } // for
        }
        finally {
          model.endUpdate();
        }
      }
    }
  }
};

/**
 * Creates an overlay object using the given tooltip and text for the alert window
 * which is being displayed on click.
 */
function createOverlay(image, tooltip) {
  var overlay = new mxCellOverlay(image, tooltip);

  // Installs a handler for clicks on the overlay
  overlay.addListener(mxEvent.CLICK, function (sender, evt) {
    mxUtils.alert(tooltip + '\nLast update: ' + new Date());
  });

  return overlay;
};

/**
 * Creates and returns an empty graph inside the given container.
 */
function createGraph(container) {
  var graph = new mxGraph(container);
  graph.setTooltips(true);
  graph.setEnabled(false);

  // Disables folding
  graph.isCellFoldable = function (cell, collapse) {
    return false;
  };

  // Creates the stylesheet for the process display
  var style = graph.getStylesheet().getDefaultVertexStyle();
  style[mxConstants.STYLE_FONTSIZE] = 11;
  style[mxConstants.STYLE_FONTCOLOR] = '#000000';
  style[mxConstants.STYLE_STROKECOLOR] = '#E3E3E3';
  style[mxConstants.STYLE_FILLCOLOR] = '#E3E3E3';
  style[mxConstants.STYLE_GRADIENTCOLOR] = 'white';
  style[mxConstants.STYLE_GRADIENT_DIRECTION] = mxConstants.DIRECTION_EAST;
  style[mxConstants.STYLE_ROUNDED] = true;
  style[mxConstants.STYLE_SHADOW] = true;
  style[mxConstants.STYLE_FONTSTYLE] = 1;

  style = graph.getStylesheet().getDefaultEdgeStyle();
  style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;
  style[mxConstants.STYLE_STROKECOLOR] = '#808080';
  style[mxConstants.STYLE_ROUNDED] = true;
  style[mxConstants.STYLE_SHADOW] = true;
  style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = '#efefef';

  style = [];
  style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_SWIMLANE;
  style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
  style[mxConstants.STYLE_STROKECOLOR] = '#E0E0DF';
  style[mxConstants.STYLE_FONTCOLOR] = '#000000';
  style[mxConstants.STYLE_FILLCOLOR] = '#E0E0DF';
  style[mxConstants.STYLE_GRADIENTCOLOR] = 'white';
  style[mxConstants.STYLE_STARTSIZE] = 30;
  style[mxConstants.STYLE_ROUNDED] = false;
  style[mxConstants.STYLE_FONTSIZE] = 12;
  style[mxConstants.STYLE_FONTSTYLE] = 0;
  style[mxConstants.STYLE_HORIZONTAL] = false;
  // To improve text quality for vertical labels in some old IE versions...
  style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = '#efefef';

  graph.getStylesheet().putCellStyle('swimlane', style);

  style = [];
  style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RHOMBUS;
  style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RhombusPerimeter;
  style[mxConstants.STYLE_STROKECOLOR] = '#91BCC0';
  style[mxConstants.STYLE_FONTCOLOR] = '000000';
  style[mxConstants.STYLE_FILLCOLOR] = '#91BCC0';
  style[mxConstants.STYLE_GRADIENTCOLOR] = 'white';
  style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
  style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
  style[mxConstants.STYLE_FONTSIZE] = 16;
  graph.getStylesheet().putCellStyle('step', style);

  style = [];
  style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_ELLIPSE;
  style[mxConstants.STYLE_PERIMETER] = mxPerimeter.EllipsePerimeter;
  style[mxConstants.STYLE_FONTCOLOR] = '000000';
  style[mxConstants.STYLE_FILLCOLOR] = '#A0C88F';
  style[mxConstants.STYLE_GRADIENTCOLOR] = 'white';
  style[mxConstants.STYLE_STROKECOLOR] = '#A0C88F';
  style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
  style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
  style[mxConstants.STYLE_FONTSIZE] = 16;
  graph.getStylesheet().putCellStyle('start', style);

  style = mxUtils.clone(style);
  style[mxConstants.STYLE_FILLCOLOR] = '#DACCBC';
  style[mxConstants.STYLE_STROKECOLOR] = '#DACCBC';
  graph.getStylesheet().putCellStyle('end', style);

  style = graph.getStylesheet().getDefaultVertexStyle();
  style = mxUtils.clone(style);
  style[mxConstants.STYLE_FILLCOLOR] = '#f8cecc';
  style[mxConstants.STYLE_STROKECOLOR] = '#f8cecc';
  graph.getStylesheet().putCellStyle('CLOSED', style);

  style = graph.getStylesheet().getDefaultVertexStyle();
  style = mxUtils.clone(style);
  style[mxConstants.STYLE_FILLCOLOR] = '#9ceda9';
  style[mxConstants.STYLE_STROKECOLOR] = '#9ceda9';
  graph.getStylesheet().putCellStyle('ACTIVE', style);

  style = graph.getStylesheet().getDefaultVertexStyle();
  style = mxUtils.clone(style);
  style[mxConstants.STYLE_FILLCOLOR] = '#c4cdff';
  style[mxConstants.STYLE_STROKECOLOR] = '#c4cdff';
  graph.getStylesheet().putCellStyle('FLOW', style);

  return graph;
};

/**
 * Returns a random state.
 */
function getState() {
  var state = 'Init';
  var rnd = Math.random() * 4;

  if (rnd > 3) {
    state = 'Completed';
  }
  else if (rnd > 2) {
    state = 'Running';
  }
  else if (rnd > 1) {
    state = 'Waiting';
  }

  return state;
};

closeModal = function (modalId) {
  if ($('#' + modalId).is(':visible')) {
    $('#' + modalId).modal('hide');
  }
}

showModal = function (modalId) {
  if (!$('#' + modalId).is(':visible')) {
    $('#' + modalId).modal();
  }
}

showAlertModal = function (header, message) {
  window['appComponentRef'].zone.run(() => {
    window['appComponentRef'].component.
      showAppJSWarning(header, message);
  });
  showModal("warningModal");
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var dataPointCount = 0;
var graph;
var oldXML;
var settingsPopupBody;
var horizontal = true;
var sourceCell;   // Used as a parent cell while adding new cell in graph.
var cellLabelChanged;
var isReadOnly = false;;
var newEdge;
var existingEdgesBeforeUpdate;

designFlowEditor = function (serverXml, readOnly) {
  isReadOnly = readOnly;

  // Checks if browser is supported
  if (!mxClient.isBrowserSupported()) {
    // Displays an error message if the browser is
    // not supported.
    mxUtils.error('Browser is not supported!', 200, false);
  }
  else {
    // Workaround for Internet Explorer ignoring certain styles

    var container = document.getElementById('editorGrid');
    // container.style.position = 'absolute';
    // container.style.overflow = 'hidden';
    // container.style.left = '0px';
    // container.style.top = '0px';
    // container.style.right = '0px';
    // container.style.bottom = '0px';
    var outline = document.getElementById('outlineContainer');
    var toolsContainer = document.getElementById('toolsContainer');
    mxEvent.disableContextMenu(container);
    if (mxClient.IS_QUIRKS) {
      document.body.style.overflow = 'hidden';
      new mxDivResizer(container);
      new mxDivResizer(outline);
      new mxDivResizer(toolsContainer);
    }
    // Sets background colour
    container.style.background = '#FFFFFF';

    // document.body.appendChild(container);
    // Creates the graph inside the given container
    graph = new mxGraph(container);

    // Enables automatic sizing for vertices after editing and
    // panning by using the left mouse button.
    graph.setCellsMovable(false);
    graph.setConnectable(true);
    graph.setAutoSizeCells(true);
    graph.setPanning(true);
    graph.centerZoom = false;
    graph.panningHandler.useLeftButtonForPanning = true;
    // Displays a popupmenu when the user clicks
    // on a cell (using the left mouse button) but
    // do not select the cell when the popup menu
    // is displayed
    graph.panningHandler.popupMenuHandler = false;
    // Creates the outline (navigator, overview) for moving
    // around the graph in the top, right corner of the window.
    var outln = new mxOutline(graph, outline);

    // Disables tooltips on touch devices
    graph.setTooltips(!mxClient.IS_TOUCH);
    // Set some stylesheet options for the visual appearance of vertices
    style = graph.getStylesheet().getDefaultEdgeStyle();
    style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;
    style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = '#ffffff';
    style[mxConstants.STYLE_FONTCOLOR] = '#000000';
    style[mxConstants.STYLE_FONTFAMILY] = 'Raleway';
    style[mxConstants.STYLE_FONTSIZE] = '12';
    style[mxConstants.STYLE_FONTSTYLE] = '1';
    style[mxConstants.STYLE_OVERFLOW] = 'width';
    style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
    style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;

    var style = graph.getStylesheet().getDefaultVertexStyle();
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
    style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
    style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_MIDDLE;
    style[mxConstants.STYLE_SPACING_LEFT] = 20;
    style[mxConstants.STYLE_SPACING_RIGHT] = 20;
    style[mxConstants.STYLE_SPACING_TOP] = 25;
    style[mxConstants.STYLE_SPACING_BOTTOM] = 25;
    style[mxConstants.STYLE_OVERFLOW] = 'width';
    style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
    style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
    style[mxConstants.STYLE_STROKECOLOR] = '#007BFF';
    style[mxConstants.STYLE_FILLCOLOR] = '#FFFFFF';
    style[mxConstants.STYLE_FONTCOLOR] = '#000000';
    style[mxConstants.STYLE_FONTFAMILY] = 'Raleway';
    style[mxConstants.STYLE_FONTSIZE] = '12';
    style[mxConstants.STYLE_FONTSTYLE] = '1';
    style[mxConstants.STYLE_SHADOW] = '1';
    style[mxConstants.STYLE_ROUNDED] = '1';
    style[mxConstants.STYLE_GLASS] = '0';

    style = mxUtils.clone(style);
    graph.getStylesheet().putCellStyle('PENDING_STATE', style);

    style = mxUtils.clone(style);
    style[mxConstants.STYLE_FILLCOLOR] = '#FFFFFF';
    style[mxConstants.STYLE_STROKECOLOR] = '#007BFF';
    graph.getStylesheet().putCellStyle('ACTIVE_STATE', style);

    style = mxUtils.clone(style);
    style[mxConstants.STYLE_FILLCOLOR] = '#FFFFFF';
    style[mxConstants.STYLE_STROKECOLOR] = '#007BFF';
    graph.getStylesheet().putCellStyle('CLOSED_STATE', style);

    style = [];
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RHOMBUS;
    style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RhombusPerimeter;
    style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
    style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;

    style[mxConstants.STYLE_STROKECOLOR] = '#007BFF';
    style[mxConstants.STYLE_FILLCOLOR] = '#FFFFFF';

    style[mxConstants.STYLE_FONTCOLOR] = '#000000';
    style[mxConstants.STYLE_FONTFAMILY] = 'Raleway';
    style[mxConstants.STYLE_FONTSIZE] = '12';
    style[mxConstants.STYLE_FONTSTYLE] = '1';

    style[mxConstants.STYLE_SHADOW] = '0';
    style[mxConstants.STYLE_GLASS] = '0';

    graph.getStylesheet().putCellStyle('decision', style);

    style = mxUtils.clone(style);
    graph.getStylesheet().putCellStyle('PENDING_DECISION', style);

    style = mxUtils.clone(style);
    style[mxConstants.STYLE_FILLCOLOR] = '#007BFF';
    style[mxConstants.STYLE_STROKECOLOR] = '#FFFFFF';
    graph.getStylesheet().putCellStyle('ACTIVE_DECISION', style);

    style = mxUtils.clone(style);
    style[mxConstants.STYLE_FILLCOLOR] = '#007BFF';
    style[mxConstants.STYLE_STROKECOLOR] = '#FFFFFF';
    graph.getStylesheet().putCellStyle('CLOSED_DECISION', style);

    style = [];
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_ELLIPSE;
    style[mxConstants.STYLE_PERIMETER] = mxPerimeter.EllipsePerimeter;
    style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
    style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;

    style[mxConstants.STYLE_STROKECOLOR] = '#007BFF';
    style[mxConstants.STYLE_FILLCOLOR] = '#FFFFFF';

    style[mxConstants.STYLE_FONTCOLOR] = '#000000';
    style[mxConstants.STYLE_FONTFAMILY] = 'Raleway';
    style[mxConstants.STYLE_FONTSIZE] = '12';
    style[mxConstants.STYLE_FONTSTYLE] = '1';

    //style[mxConstants.STYLE_SHADOW] = '1';
    //style[mxConstants.STYLE_GLASS] = '0';

    graph.getStylesheet().putCellStyle('start', style);

    style = mxUtils.clone(style);
    graph.getStylesheet().putCellStyle('PENDING_START', style);

    style = mxUtils.clone(style);
    style[mxConstants.STYLE_FILLCOLOR] = '#FFFFFF';
    style[mxConstants.STYLE_STROKECOLOR] = '#007BFF';
    graph.getStylesheet().putCellStyle('ACTIVE_START', style);

    style = mxUtils.clone(style);
    style[mxConstants.STYLE_FILLCOLOR] = '#FFFFFF';
    style[mxConstants.STYLE_STROKECOLOR] = '#007BFF';
    graph.getStylesheet().putCellStyle('CLOSED_START', style);

    style = mxUtils.clone(style);
    style[mxConstants.STYLE_STROKEWIDTH] = '2';
    style[mxConstants.STYLE_STROKECOLOR] = '#007BFF';
    style[mxConstants.STYLE_FILLCOLOR] = '#FFFFFF';
    graph.getStylesheet().putCellStyle('end', style);

    style = mxUtils.clone(style);
    graph.getStylesheet().putCellStyle('PENDING_END', style);

    style = mxUtils.clone(style);
    style[mxConstants.STYLE_FILLCOLOR] = '#FFFFFF';
    style[mxConstants.STYLE_STROKECOLOR] = '#007BFF';
    graph.getStylesheet().putCellStyle('ACTIVE_END', style);

    style = mxUtils.clone(style);
    style[mxConstants.STYLE_FILLCOLOR] = '#FFFFFF';
    style[mxConstants.STYLE_STROKECOLOR] = '#007BFF';
    graph.getStylesheet().putCellStyle('CLOSED_END', style);

    // style[mxConstants.STYLE_IMAGE] = 'assets/js/mxGraph/images/dude3.png';
    // style[mxConstants.STYLE_IMAGE_WIDTH] = '24';
    // style[mxConstants.STYLE_IMAGE_HEIGHT] = '24';
    // style[mxConstants.STYLE_SPACING] = 8;
    // Sets the default style for edges
    style = graph.getStylesheet().getDefaultEdgeStyle();
    style[mxConstants.STYLE_ROUNDED] = true;
    style[mxConstants.STYLE_STROKEWIDTH] = 2;
    // style[mxConstants.STYLE_EXIT_X] = 1.0; // right
    // style[mxConstants.STYLE_EXIT_Y] = 0.5; // center
    style[mxConstants.STYLE_EXIT_PERIMETER] = 1; // disabled
    // style[mxConstants.STYLE_ENTRY_X] = 0; // left
    // style[mxConstants.STYLE_ENTRY_Y] = 0.5; // center
    style[mxConstants.STYLE_ENTRY_PERIMETER] = 1; // disabled

    // Disable the following for straight lines
    style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;

    style = mxUtils.clone(style);
    style[mxConstants.STYLE_EDGE] = mxEdgeStyle.EntityRelation;
    graph.getStylesheet().putCellStyle('multipleParents', style);

    // Stops editing on enter or escape keypress
    var keyHandler = new mxKeyHandler(graph);
    keyHandler.bindKey(46, function (evt) {
      if (graph.isEnabled()) {
        var selectedCells = graph.selectionModel.cells;
        for (var index = 0; index < selectedCells.length; index++) {
          var cell = selectedCells[index];
          if (cell.edge) {
            var targetCell = cell.target;
            var allEdges = graph.getChildEdges(graph.getDefaultParent());
            var keepTargetCell = false;
            for (var edge of allEdges) {
              if (edge != cell && edge.target == targetCell) {
                keepTargetCell = true;
                break;
              }
            }

            if (!keepTargetCell) {
              deleteSubtree(graph, cell.target);
            }
          }

          if (cell.style != 'start') {
            deleteSubtree(graph, selectedCells[index]);
          }
        }
        //deleteSubtree()
        // graph.removeCells();
      }
    });
    // Enables automatic layout on the graph and installs
    // a tree layout for all groups who's children are
    // being changed, added or removed.
    // var layout = new mxCompactTreeLayout(graph, true);
    var layout = new mxHierarchicalLayout(graph, mxConstants.DIRECTION_WEST);
    layout.useBoundingBox = true;
    layout.edgeRouting = false;
    layout.levelDistance = 100;
    layout.nodeDistance = 50;

    // Hierarchical Layout Properties
    layout.edgeStyle = mxHierarchicalEdgeStyle.CURVE;
    layout.intraCellSpacing = 100;
    layout.parallelEdgeSpacing = 100;
    layout.interRankCellSpacing = 150;
    layout.interHierarchySpacing = 100;
    // Allows the layout to move cells even though cells
    // aren't movable in the graph
    layout.isVertexMovable = function (cell) {
      return true;
    };
    var layoutMgr = new mxLayoutManager(graph);
    layoutMgr.getLayout = function (cell) {
      if (cell.getChildCount() > 0) {
        return layout;
      }
    };
    // Installs a popupmenu handler using local function (see below).
    graph.popupMenuHandler.factoryMethod = function (menu, cell, evt) {
      return createPopupMenu(graph, menu, cell, evt, horizontal);
    };
    // Fix for wrong preferred size
    var oldGetPreferredSizeForCell = graph.getPreferredSizeForCell;
    graph.getPreferredSizeForCell = function (cell) {
      var result = oldGetPreferredSizeForCell.apply(this, arguments);
      if (result != null) {
        result.width = Math.max(120, result.width);
      }
      return result;
    };

    // Sets the maximum text scale to 1
    /*graph.cellRenderer.getTextScale = function(state)
    {
      return Math.min(1, state.view.scale);
    };*/
    // Dynamically adds text to the label as we zoom in
    // (without affecting the preferred size for new cells)
    /*graph.cellRenderer.getLabelValue = function(state)
    {
      var result = state.cell.value;
      
      if (state.view.graph.getModel().isVertex(state.cell))
      {
        if (state.view.scale > 1)
        {
          result += '\nDetails 1';
        }
        
        if (state.view.scale > 1.3)
        {
          result += '\nDetails 2';
        }
      }
      
      return result;
    };*/

    // Cell label from custom object
    // graph.setHtmlLabels(true);
    graph.convertValueToString = function (cell) {
      var data = cell.getValue();

      if (data) {
        try {
          if (data.stateCd) {
            return data.stateCd;
          } else if (data.eventCd) {
            return data.eventCd;
          }
        } catch (exception) {

        }

        return data;
      }

      return '';
    };

    cellLabelChanged = graph.cellLabelChanged;
    graph.cellLabelChanged = function (cell, newValue, autoSize) {
      var data = cell.getValue();

      if (data) {
        try {
          if (data.eventCd) {
            return;
          } else if (data.stateCd) {
            data.stateCd = newValue;
            newValue = data;

            cellLabelChanged.apply(this, arguments);
            return;
          }
        } catch (exception) {

        }
      }

      cellLabelChanged.apply(this, arguments);
    };

    if (serverXml) {
      // Reads xml for graph obtained from server and renders it

      var doc = mxUtils.parseXml(serverXml);
      var codec = new mxCodec(doc);
      codec.decode(doc.documentElement, graph.getModel());

      var allVertices = graph.getChildVertices(graph.getDefaultParent());
      for (var index = 0; index < allVertices.length; index++) {
        graph.traverse(allVertices[index], true, function (vertex) {
          if (index == 0) {
            // To scroll graph so that our cell would appear in center
            graph.scrollCellToVisible(vertex, true);
          }

          addOverlays(graph, vertex, index != 0, horizontal);
        });
      }
    } else {
      // Gets the default parent for inserting new cells. This
      // is normally the first child of the root (ie. layer 0).
      var parent = graph.getDefaultParent();
      // Adds the root vertex of the tree
      graph.getModel().beginUpdate();
      try {
        var w = graph.container.offsetWidth;
        var h = graph.container.offsetHeight;
        var v1 = graph.insertVertex(parent, 'treeRoot',
          '', w / 2, h / 2, 50, 50, 'start'/*, 'image=assets/js/mxGraph/images/house.png'*/);
        // graph.updateCellSize(v1);
        addOverlays(graph, v1, false, horizontal);
      }
      finally {
        // Updates the display
        graph.getModel().endUpdate();
      }

      // To scroll graph so that our cell would appear in center
      graph.scrollCellToVisible(v1, true);
    }

    mxConnectionHandlerInsertEdge = mxConnectionHandler.prototype.insertEdge;
    mxConnectionHandler.prototype.insertEdge = function (parent, id, value, source, target, style) {
      if (target && target.id == 'treeRoot') {
        window['appComponentRef'].zone.run(() => {
          window['appComponentRef'].component.
            showAppJSWarning("Not Allowed", "You are not allowed to connect to the root state. Please select any other state.");
        });
        showModal("warningModal");
        return;
      }

      if (source && source.value && source.value.stateCd && !(typeof source.value === 'string' || source.value instanceof String)) {

        var sourceEvents = [];
        var existingEdges = getEdgesByStateCd(source);

        for (var edge of existingEdges) {
          if (edge.target.value.stateCd == target.value.stateCd) {
            window['appComponentRef'].zone.run(() => {
              window['appComponentRef'].component.
                showAppJSWarning("Used State", "The state you are trying to connect to is already connected from current state. Please choose any other state.");
            });
            showModal("warningModal");
            return;
          }
        }

        for (var event of source.value.events) {
          var unique = true;
          for (var edge of existingEdges) {
            if (event.eventCd == edge.value.eventCd) {
              unique = false;
              break;
            }
          }

          if (unique) {
            sourceEvents.push(event);
          }
        }

        if (sourceEvents && sourceEvents.length > 0) {
          newEdge = mxConnectionHandlerInsertEdge.apply(this, arguments);
          window['flowComponentRef'].zone.run(() => { window['flowComponentRef'].component.addEdge(sourceEvents); });
          showModal("newEdgeModal");
          return newEdge;
        }
      }

      window['appComponentRef'].zone.run(() => {
        window['appComponentRef'].component.
          showAppJSWarning("No Events Left", "There aren't any source events left to be attached to the new state, thus this connection can't be made.");
      });
      showModal("warningModal");
      return;
    };
    addTaskIconOverlays(graph)
  }
};


function getEdgesByStateCd(source) {
  var sourceEdges = [];
  var edges = graph.getChildEdges(graph.getDefaultParent());

  for (var edge of edges) {
    if (source.id == "treeRoot") {
      if (edge.source.id == source.id) {
        sourceEdges.push(edge);
      }
    } else if (edge != null && edge.value != null && edge.source != null && edge.source.value != null && !(typeof edge.source.value === 'string' || edge.source.value instanceof String) && !(typeof edge.value === 'string' || edge.value instanceof String)) {
      if (edge.source.value.stateId == source.value.stateId) {
        sourceEdges.push(edge);
      }
    }
  }

  return sourceEdges;
}



// Function to create the entries in the popupmenu
function createPopupMenu(graph, menu, cell, evt, horizontal) {
  var model = graph.getModel();
  if (!isReadOnly && cell != null) {
    menu.addItem('Edit label', './assets/js/mxGraph/images/text.gif', function () {
      graph.startEditingAtCell(cell);
    });
    if (cell.id != 'treeRoot' && cell.value && !(typeof cell.value === "string" || cell.value instanceof String)) {
      menu.addItem('Delete', './assets/js/mxGraph/images/delete.gif', function () {
        deleteSubtree(graph, cell);
      });

      menu.addItem('Edit', '', function () {
        try {
          if (model.isVertex(cell)) {
            sourceCell = cell;

            var state = cell.value;
            if (state && (typeof state === 'string' || state instanceof String)) {
              state = null;
            }

            existingEdgesBeforeUpdate = getEdgesByStateCd(sourceCell);

            window['flowComponentRef'].zone.run(() => { window['flowComponentRef'].component.updateState(state); })
            showModal("stateModal");
          } else {
            sourceCell = null;
            var vertices = graph.getChildVertices(graph.getDefaultParent());
            for (var vertex of vertices) {
              if (vertex && vertex.value && !(typeof vertex.value === "string" || vertex.value instanceof String)) {
                if (vertex.value.stateCd == cell.source.value.stateCd) {
                  sourceCell = vertex;
                  break;
                }
              }
            }

            if (sourceCell) {
              var state = sourceCell.value;
              if (state && (typeof state === 'string' || state instanceof String)) {
                state = null;
              }

              existingEdgesBeforeUpdate = getEdgesByStateCd(sourceCell);

              var childStateList = [];
              for (var edge of existingEdgesBeforeUpdate) {
                childStateList.push(edge.target.value.stateCd);
              }

              window['flowComponentRef'].zone.run(() => {
                window['flowComponentRef'].component.eventsMismatch(state, state.events, childStateList, "Reassign Events",
                  "Select unique event for each child state. Don't assign same event to multiple states or leave any child state unassigned.");
              });
              showModal("reassignEventsModal");
            }
          }
        } catch (exception) {
          // console.log(exception);
        }
      });
    }
    menu.addSeparator();
  }
  menu.addItem('Fit', './assets/js/mxGraph/images/zoom.gif', function () {
    graph.fit();
  });
  menu.addItem('Actual', './assets/js/mxGraph/images/zoomactual.gif', function () {
    graph.zoomActual();
  });
  menu.addSeparator();
  menu.addItem('Print', './assets/js/mxGraph/images/print.gif', function () {
    var scale = mxUtils.getScaleForPageCount(1, graph);
    var preview = new mxPrintPreview(graph, scale);
    preview.open();
  });
  menu.addItem('Poster Print', './assets/js/mxGraph/images/print.gif', function () {
    var pageCount = mxUtils.prompt('Enter maximum page count', '1');
    if (pageCount != null) {
      var scale = mxUtils.getScaleForPageCount(pageCount, graph);
      var preview = new mxPrintPreview(graph, scale);
      preview.open();
    }
  });
};

function addOverlays(graph, cell, addDeleteIcon, horizontal) {
  graph.removeCellOverlays(cell);

  if (!isReadOnly && cell.style != 'end') {
    var overlay = new mxCellOverlay(new mxImage('./assets/js/mxGraph/images/add.png', 24, 24), 'Add child');

    overlay.cursor = 'hand';
    if (horizontal) {
      overlay.align = mxConstants.ALIGN_RIGHT;
      overlay.verticalAlign = mxConstants.ALIGN_MIDDLE;
    } else {
      overlay.align = mxConstants.ALIGN_CENTER;
      overlay.verticalAlign = mxConstants.ALIGN_BOTTOM;
    }

    overlay.addListener(mxEvent.CLICK, mxUtils.bind(this, function (sender, evt) {
      try {
        sourceCell = cell;

        if (sourceCell.id == 'treeRoot') {
          var existingEdges = getEdgesByStateCd(sourceCell);
          if (existingEdges == 0) {
            window['flowComponentRef'].zone.run(() => { window['flowComponentRef'].component.addState(null); });
            showModal("stateModal");
            return;
          } else {
            window['appComponentRef'].zone.run(() => {
              window['appComponentRef'].component.
                showAppJSWarning("Not Allowed", "Root state can only have one child state. You can't create more than one child for root state.");
            });
            showModal("warningModal");
            return;
          }
        } else {
          let parentState = sourceCell.value;
          var existingEdges = getEdgesByStateCd(sourceCell);
          var sourceEvents = [];

          for (var event of parentState.events) {
            var unique = true;
            for (var edge of existingEdges) {
              if (event.eventCd == edge.value.eventCd) {
                unique = false;
                break;
              }
            }

            if (unique) {
              sourceEvents.push(event);
            }
          }

          if (sourceEvents && sourceEvents.length > 0) {
            window['flowComponentRef'].zone.run(() => { window['flowComponentRef'].component.addState(sourceEvents); });
            showModal("stateModal");
            return;
          }
        }

        window['appComponentRef'].zone.run(() => {
          window['appComponentRef'].component.
            showAppJSWarning("No Events Left", "There aren't any source events from which the new state can be created.");
        });
        showModal("warningModal");
        return;
      } catch (exception) {

      }
    }));
    graph.addCellOverlay(cell, overlay);
  }

  if (!isReadOnly && addDeleteIcon) {
    overlay = new mxCellOverlay(new mxImage('./assets/js/mxGraph/images/close.png', 30, 30), 'Delete');
    overlay.cursor = 'hand';
    // overlay.offset = new mxPoint(-4, 8);
    overlay.align = mxConstants.ALIGN_RIGHT;
    overlay.verticalAlign = mxConstants.ALIGN_TOP;
    overlay.addListener(mxEvent.CLICK, mxUtils.bind(this, function (sender, evt) {
      deleteSubtree(graph, cell);
    }));

    graph.addCellOverlay(cell, overlay);
  }
};

function addChild(graph, cell, customObject, horizontal, stateCode, stateLabel, stateType) {
  var model = graph.getModel();
  var parent = graph.getDefaultParent();
  var vertex;
  model.beginUpdate();
  try {
    if (!stateLabel || stateLabel.length == 0) {
      stateLabel = 'Double click to set name';
    }

    var stateTrigger = null;
    if (customObject && customObject.trigger) {
      stateTrigger = customObject.trigger;
      customObject.trigger = null;
    }

    var circleSize = 50;
    if (stateType == 'Start') {
      vertex = graph.insertVertex(parent, null, '', 0, 0, 0, 0, 'start', false);
      var cellId = vertex.id;
      var stateData = vertex.value;
      stateData.stateId = cellId;
      vertex.value = stateData;

      var geometry = model.getGeometry(vertex);
      geometry.width = circleSize;
      geometry.height = circleSize;
    } else if (stateType == 'Decision State' || (customObject && customObject.events && customObject.events.length > 1)) {
      vertex = graph.insertVertex(parent, null, customObject, 0, 0, 0, 0, 'decision', false);
      var cellId = vertex.id;
      var stateData = vertex.value;
      stateData.stateId = cellId;
      vertex.value = stateData;

      var size = graph.getPreferredSizeForCell(vertex);
      var geometry = model.getGeometry(vertex);
      geometry.width = size.width;
      geometry.height = size.height;

      if (sourceCell != null) {
        vertex.source = sourceCell;
      }
    } else if (stateType == 'End' || (customObject && customObject.events && customObject.events.length == 0)) {
      vertex = graph.insertVertex(parent, null, customObject, 0, 0, 0, 0, 'end', false);
      var cellId = vertex.id;
      var stateData = vertex.value;
      stateData.stateId = cellId;
      vertex.value = stateData;

      var geometry = model.getGeometry(vertex);
      geometry.width = circleSize;
      geometry.height = circleSize;

      if (sourceCell != null) {
        vertex.source = sourceCell;
      }
    } else {
      vertex = graph.insertVertex(parent, null, customObject);
      var cellId = vertex.id;
      var stateData = vertex.value;
      stateData.stateId = cellId;
      vertex.value = stateData;

      var size = graph.getPreferredSizeForCell(vertex);
      var geometry = model.getGeometry(vertex);
      geometry.width = size.width;
      geometry.height = size.height;

      if (sourceCell != null) {
        vertex.source = sourceCell;
      }
    }

    // vertex.source = cell;

    var edge = null;
    if (stateTrigger) {
      edge = graph.insertEdge(parent, null, stateTrigger, cell, vertex, null);
    } else {
      edge = graph.insertEdge(parent, null, '', cell, vertex, null);
    }
    // Updates the geometry of the vertex with the
    // preferred size computed in the graph

    // Adds the edge between the existing cell
    // and the new vertex and executes the
    // automatic layout on the parent

    // Configures the edge label "in-place" to reside
    // at the end of the edge (x = 1) and with an offset
    // of 20 pixels in negative, vertical direction.
    edge.geometry.x = 0;
    edge.geometry.y = 0;
    edge.geometry.offset = new mxPoint(0, -15);
    addOverlays(graph, vertex, true, horizontal);
  }
  finally {
    model.endUpdate();
  }

  return vertex;
};

function deleteSubtree(graph, cell) {

  graph.getModel().beginUpdate();
  try {
    // Gets the subtree from cell downwards
    var cells = [];
    graph.traverse(cell, true, function (vertex) {
      cells.push(vertex);

      return true;
    });

    graph.removeCells(cells);
    graph.getView().validate();
  } finally {
    graph.getModel().endUpdate();
  }
};

function getSourceEdgesCount(graph, cell) {
  if (cell.isVertex) {
    var allEdges = graph.getChildEdges(graph.getDefaultParent());
    var sourceEdgesCount = 0;
    for (var edge of allEdges) {
      if (edge.target == cell) {
        sourceEdgesCount++;
      }
    }
    return sourceEdgesCount;
  } else {
    return 0;
  }
}

hierarchyGraphTools = function (choice) {
  switch (choice) {
    case 'ZOOM_IN': // Zoom In
      hierarchygraph.zoomIn();
      break;
    case 'ZOOM_OUT': // Zoom Out
      hierarchygraph.zoomOut();
      break;
    case 'ZOOM_ACTUAL': // Zoom Actual
      hierarchygraph.zoomActual();
      break;
    case 'PRINT_PREVIEW': // Print Preview
      var scale = mxUtils.getScaleForPageCount(1, hierarchygraph);
      var preview = new mxPrintPreview(hierarchygraph, scale);
      preview.open();
      break;
    case 'POSTER_PRINT': // Poster Print
      var pageCount = prompt('Enter maximum page count', '1');
      if (pageCount != null) {
        var scale = mxUtils.getScaleForPageCount(pageCount, hierarchygraph);
        var preview = new mxPrintPreview(hierarchygraph, scale);
        preview.open();
      }
      break;
  }
}

graphTools = function (choice) {
  switch (choice) {
    case 'ZOOM_IN': // Zoom In
      graph.zoomIn();
      break;
    case 'ZOOM_OUT': // Zoom Out
      graph.zoomOut();
      break;
    case 'ZOOM_ACTUAL': // Zoom Actual
      graph.zoomActual();
      break;
    case 'PRINT_PREVIEW': // Print Preview
      var scale = mxUtils.getScaleForPageCount(1, graph);
      var preview = new mxPrintPreview(graph, scale);
      preview.open();
      break;
    case 'POSTER_PRINT': // Poster Print
      var pageCount = prompt('Enter maximum page count', '1');
      if (pageCount != null) {
        var scale = mxUtils.getScaleForPageCount(pageCount, graph);
        var preview = new mxPrintPreview(graph, scale);
        preview.open();
      }
      break;
  }
}

saveStateObject = function (state) {
  var vertices = graph.getChildVertices(graph.getDefaultParent());
  for (var vertex of vertices) {
    if (vertex.value && !(typeof vertex.value === 'string' || vertex.value instanceof String)) {
      if (state.stateCd == vertex.value.stateCd) {
        window['appComponentRef'].zone.run(() => {
          window['appComponentRef'].component.
            showAppJSWarning("Duplicate State", "Duplicate states found. State '" + state.stateCd + "' is already being used. Please use different state code for defining the state.");
        });
        showModal("warningModal");
        return;
      }
    }
  }

  var newEvents = state.events;
  for (var event of newEvents) {
    var repeatCount = 0;
    for (var internalEvent of newEvents) {
      if (event.eventCd == internalEvent.eventCd) {
        repeatCount++;
      }

      if (repeatCount > 1) {
        window['appComponentRef'].zone.run(() => {
          window['appComponentRef'].component.
            showAppJSWarning("Duplicate Events", "Duplicate events found. All the events must be unique.");
        });
        showModal("warningModal");
        return;
      }
    }

    for (var vertex of vertices) {
      if (vertex.value && !(typeof vertex.value === 'string' || vertex.value instanceof String)) {
        for (var stateEvent of vertex.value.events) {
          if (event.eventCd == stateEvent.eventCd) {
            window['appComponentRef'].zone.run(() => {
              window['appComponentRef'].component.
                showAppJSWarning("Duplicate Events", "Duplicate events found. Event '" + event.eventCd + "' is already defined as a source event in state '" + vertex.value.stateCd + "'. Please use different event code for defining the event.");
            });
            showModal("warningModal");
            return;
          }
        }
      }
    }
  }

  var vertex = addChild(graph, sourceCell, state, horizontal, '', '', '');
  closeModal('stateModal');
}

updateStateObject = function (state) {
  var vertices = graph.getChildVertices(graph.getDefaultParent());
  for (var vertex of vertices) {
    if (vertex.value && !(typeof vertex.value === 'string' || vertex.value instanceof String)) {
      if ((state.stateCd == vertex.value.stateCd) && (vertex.value.stateCd != sourceCell.value.stateCd)) {
        window['appComponentRef'].zone.run(() => {
          window['appComponentRef'].component.
            showAppJSWarning("Duplicate State", "Duplicate states found. State '" + state.stateCd + "' is already being used. Please use different state code for defining the state.");
        });
        showModal("warningModal");
        return;
      }
    }
  }

  var newEvents = state.events;
  for (var event of newEvents) {
    var repeatCount = 0;
    for (var internalEvent of newEvents) {
      if (event.eventCd == internalEvent.eventCd) {
        repeatCount++;
      }

      if (repeatCount > 1) {
        window['appComponentRef'].zone.run(() => {
          window['appComponentRef'].component.
            showAppJSWarning("Duplicate Events", "Duplicate events found. All the events must be unique.");
        });
        showModal("warningModal");
        return;
      }
    }

    for (var vertex of vertices) {
      if (vertex.value && !(typeof vertex.value === 'string' || vertex.value instanceof String)) {
        if (vertex.value.stateCd !== sourceCell.value.stateCd) {
          for (var stateEvent of vertex.value.events) {
            if (event.eventCd == stateEvent.eventCd) {
              window['appComponentRef'].zone.run(() => {
                window['appComponentRef'].component.
                  showAppJSWarning("Duplicate Events", "Duplicate events found. Event '" + event.eventCd + "' is already defined as a source event in state '" + vertex.value.stateCd + "'. Please use different event code for defining the event.");
              });
              showModal("warningModal");
              return;
            }
          }
        }
      }
    }
  }
  closeModal('stateModal');

  if (existingEdgesBeforeUpdate) {

    if (existingEdgesBeforeUpdate.length > newEvents.length) {
      var childStateCount = existingEdgesBeforeUpdate.length;
      var newEventCount = newEvents.length;
      var difference = childStateCount - newEventCount;
      window['appComponentRef'].zone.run(() => {
        window['appComponentRef'].component.
          showAppJSWarning("Event Mismatch", "There already exisits " + childStateCount + " child state(s) for the current state. After update there will be a total number of " + newEventCount + " events left, which doesn't suffice the total child states. Please add " + difference + " more event(s) or delete " + difference + " child state(s) to suffice the conditions.");
      });
      showModal("warningModal");
      return;
    } else {
      for (var edge of existingEdgesBeforeUpdate) {
        var notFound = true;
        for (var event of newEvents) {
          if (edge.value.eventCd == event.eventCd) {
            notFound = false;
            break;
          }
        }

        if (notFound) {
          var childStateList = [];
          for (var edge of existingEdgesBeforeUpdate) {
            childStateList.push(edge.target.value.stateCd);
          }

          window['flowComponentRef'].zone.run(() => {
            window['flowComponentRef'].component.eventsMismatch(state, newEvents, childStateList, "Event Mismatch",
              "One or more events doesn't match with already assigned events to the child states. Please reassign the updated event(s) to each child state.");
          });
          showModal("reassignEventsModal");
          return;
        }
      }
    }
  }

  if (sourceCell) {
    graph.getModel().beginUpdate();
    try {
      sourceCell.setValue(state);

      if (state && state.events && state.events.length > 1) {
        var size = graph.getPreferredSizeForCell(sourceCell);
        var geometry = graph.getModel().getGeometry(sourceCell);
        geometry.width = size.width;
        geometry.height = size.height;
      } else if (state && state.events && state.events.length == 0) {
        var geometry = graph.getModel().getGeometry(sourceCell);
        geometry.width = circleSize;
        geometry.height = circleSize;
      } else {
        var size = graph.getPreferredSizeForCell(sourceCell);
        var geometry = graph.getModel().getGeometry(sourceCell);
        geometry.width = size.width;
        geometry.height = size.height;
      }

      addOverlays(graph, sourceCell, true, horizontal);

      graph.getView().clear(cell, false, false);
      graph.getView().validate();
      graph.cellSizeUpdated(sourceCell, false);
    } finally {
      graph.getModel().endUpdate();
    }
  }
}

updateStateTrigger = function (eventEdgeMap, stateData) {
  for (var key in eventEdgeMap) {
    if (key && (!eventEdgeMap[key] || eventEdgeMap[key] == null)) {
      window['appComponentRef'].zone.run(() => {
        window['appComponentRef'].component.
          showAppJSWarning("Error", "You can't leave trigger for any child state empty. Please fill in all values.");
      });
      showModal("warningModal");
      return;
    }
  }

  for (var key in eventEdgeMap) {
    var repeatCount = 0;
    for (var internalKey in eventEdgeMap) {
      if (eventEdgeMap[key] == eventEdgeMap[internalKey]) {
        repeatCount++;
      }

      if (repeatCount > 1) {
        var childStateList = [];
        for (var edge of existingEdgesBeforeUpdate) {
          childStateList.push(edge.target.value.stateCd);
        }

        window['appComponentRef'].zone.run(() => {
          window['appComponentRef'].component.
            showAppJSWarning("Error", "Same event has been assigned to '" + key + "' and '" + internalKey + "'. One event can be attached to only one child state at max");
        });
        showModal("warningModal");
        return;
      }
    }
  }

  for (var edge of existingEdgesBeforeUpdate) {
    graph.getModel().beginUpdate();
    try {
      edge.value = eventEdgeMap[edge.target.value.stateCd];
    } finally {
      graph.getModel().endUpdate();
    }
  }

  updateStateObject(stateData);
}

exportGraphXml = function () {
  var encoder = new mxCodec();
  var node = encoder.encode(graph.getModel());
  var xml = mxUtils.getXml(node);

  var states = getValueForAllVertices();
  var transitions = getTransitionForAllVertices();

  try {
    window['flowComponentRef'].zone.run(() => { window['flowComponentRef'].component.saveGraphXml(xml, states, transitions); })
  } catch (exception) {
    // console.log(exception);
  }
}

getValueForAllVertices = function () {
  var states = [];
  var vertices = graph.getChildVertices(graph.getDefaultParent());
  for (var vertex of vertices) {
    if (vertex != null && vertex.value != null && !(typeof vertex.value === 'string' || vertex.value instanceof String)) {
      states.push(vertex.value);
    }
  }

  return states;
}

getTransitionForAllVertices = function () {
  var transitions = [];
  var edges = graph.getChildEdges(graph.getDefaultParent());
  for (var edge of edges) {
    if (edge != null && edge.value != null && edge.source.value != null && edge.target.value != null && !(typeof edge.value == "string" || edge.value instanceof String) && !(typeof edge.source.value == "string" || edge.source.value instanceof String) && !(typeof edge.target.value == "string" || edge.target.value instanceof String)) {
      var transition = {};

      transition.sourceStateCd = edge.source.value.stateCd;
      transition.targetStateCd = edge.target.value.stateCd;
      transition.eventCd = edge.value.eventCd;

      transitions.push(transition);
    }
  }

  return transitions;
}

styleStates = function (activeStateIdList, closedStateIdList) {
  if (activeStateIdList != null && closedStateIdList != null) {
    graph.getModel().beginUpdate();
    try {
      var vertices = graph.getChildVertices(graph.getDefaultParent());
      for (var vertex of vertices) {
        if (vertex != null && vertex.id != null) {
          if (activeStateIdList.indexOf(vertex.id) >= 0) {
            graph.setCellStyles(mxConstants.STYLE_STROKECOLOR, '#007BFF', [vertex]);
            graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, '#FFFFFF', [vertex]);
            var overlay = new mxCellOverlay(new mxImage('./assets/js/mxGraph/images/active.png', 18, 18), 'Active');
            overlay.align = mxConstants.ALIGN_RIGHT;
            overlay.verticalAlign = mxConstants.ALIGN_MIDDLE;
            graph.addCellOverlay(vertex, overlay);
          } else if (closedStateIdList.indexOf(vertex.id) >= 0) {
            graph.setCellStyles(mxConstants.STYLE_STROKECOLOR, '#28A745', [vertex]);
            graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, '#FFFFFF', [vertex]);
            var overlay = new mxCellOverlay(new mxImage('./assets/js/mxGraph/images/check.png', 18, 18), 'Closed');
            overlay.align = mxConstants.ALIGN_RIGHT;
            overlay.verticalAlign = mxConstants.ALIGN_MIDDLE;
            graph.addCellOverlay(vertex, overlay);
          } else if (vertex != null && vertex.id == 'treeRoot') {
            graph.setCellStyles(mxConstants.STYLE_STROKECOLOR, '#28A745', [vertex]);
            graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, '#FFFFFF', [vertex]);
            var overlay = new mxCellOverlay(new mxImage('./assets/js/mxGraph/images/check.png', 18, 18), 'Closed');
            overlay.align = mxConstants.ALIGN_RIGHT;
            overlay.verticalAlign = mxConstants.ALIGN_MIDDLE;
            graph.addCellOverlay(vertex, overlay);
          }

        }
      }
    } finally {
      graph.getModel().endUpdate();
    }
  }
  addTaskIconOverlays(graph);
}


styleProcessAuditStates = function (activeStateIdList, closedStateIdList) {

  if (activeStateIdList != null && closedStateIdList != null) {
    graph.getModel().beginUpdate();
    try {
      var vertices = graph.getChildVertices(graph.getDefaultParent());
      for (var vertex of vertices) {
        if (vertex != null && vertex.id != null) {
          if (activeStateIdList.indexOf(vertex.id) >= 0) {
            graph.setCellStyles(mxConstants.STYLE_STROKECOLOR, '#CDDDF7', [vertex]);
            graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, '#CDDDF7', [vertex]);
            var overlay = new mxCellOverlay(new mxImage('./assets/js/mxGraph/images/warning.gif', 18, 18), 'Active');
            overlay.align = mxConstants.ALIGN_RIGHT;
            overlay.verticalAlign = mxConstants.ALIGN_MIDDLE;
            graph.addCellOverlay(vertex, overlay);
          } if (activeStateIdList.indexOf(vertex.id) >= 0) {
            graph.setCellStyles(mxConstants.STYLE_STROKECOLOR, '#CDDDF7', [vertex]);
            graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, '#CDDDF7', [vertex]);
            var overlay = new mxCellOverlay(new mxImage('./assets/js/mxGraph/images/info.png', 18, 18), 'Information');
            overlay.align = mxConstants.ALIGN_LEFT;
            overlay.verticalAlign = mxConstants.ALIGN_TOP;

            overlay.cursor = 'hand';
            overlay.addListener(mxEvent.CLICK, mxUtils.bind(this, function (sender, evt) {
              var cell = evt.getProperty('cell')
              try {
                window['processAuditRef'].zone.run(() => { window['processAuditRef'].component.showStateInfo(cell.value); })

              }
              catch (exception) {
                // console.log(exception);
              }

            }));

            graph.addCellOverlay(vertex, overlay);


          } if (closedStateIdList.indexOf(vertex.id) >= 0) {
            graph.setCellStyles(mxConstants.STYLE_STROKECOLOR, '#CDDDF7', [vertex]);
            graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, '#CDDDF7', [vertex]);
            var overlay = new mxCellOverlay(new mxImage('./assets/js/mxGraph/images/info.png', 18, 18), 'Information');
            overlay.align = mxConstants.ALIGN_LEFT;
            overlay.verticalAlign = mxConstants.ALIGN_TOP;

            overlay.cursor = 'hand';
            overlay.addListener(mxEvent.CLICK, mxUtils.bind(this, function (sender, evt) {
              var cell = evt.getProperty('cell')
              try {
                window['processAuditRef'].zone.run(() => { window['processAuditRef'].component.showStateInfo(cell.value); })

              }
              catch (exception) {
                // console.log(exception);
              }

            }));

            graph.addCellOverlay(vertex, overlay);


          }
          else if (closedStateIdList.indexOf(vertex.id) >= 0) {
            graph.setCellStyles(mxConstants.STYLE_STROKECOLOR, '#CDDDF7', [vertex]);
            graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, '#CDDDF7', [vertex]);
            var overlay = new mxCellOverlay(new mxImage('./assets/js/mxGraph/images/check.png', 18, 18), 'Closed');
            overlay.align = mxConstants.ALIGN_RIGHT;
            overlay.verticalAlign = mxConstants.ALIGN_MIDDLE;
            graph.addCellOverlay(vertex, overlay);
          }
          else if (vertex != null && vertex.id == 'treeRoot') {
            graph.setCellStyles(mxConstants.STYLE_STROKECOLOR, '#CDDDF7', [vertex]);
            graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, '#CDDDF7', [vertex]);
            var overlay = new mxCellOverlay(new mxImage('./assets/js/mxGraph/images/check.png', 18, 18), 'Closed');
            overlay.align = mxConstants.ALIGN_RIGHT;
            overlay.verticalAlign = mxConstants.ALIGN_MIDDLE;
            graph.addCellOverlay(vertex, overlay);
          }

        }
      }
    } finally {
      graph.getModel().endUpdate();
    }
  }
  addTaskIconOverlays(graph);
}

styleInfo = function (orModels, type) {

  addInfoOverlays(graph, orModels, type);
}



updateNewEdge = function (event) {
  if (newEdge) {
    graph.getModel().beginUpdate();
    try {
      newEdge.setValue(event);
      graph.getView().clear(newEdge, false, false);
      graph.getView().validate();
    } finally {
      graph.getModel().endUpdate();
    }
  }
}

deleteNewEdge = function () {
  if (newEdge) {
    graph.getModel().beginUpdate();
    try {
      var cells = [];
      cells.push(newEdge);

      graph.removeCells(cells);
      graph.getView().validate();
    } finally {
      graph.getModel().endUpdate();
    }
  }
}

initializeGraphOnInit = function () {

  try { init_sparklines(); } catch (e) { }
  try { init_flot_chart(); } catch (e) { }
  try { init_sidebar(); } catch (e) { }
  try { init_wysiwyg(); } catch (e) { }
  try { init_InputMask(); } catch (e) { }
  try { init_JQVmap(); } catch (e) { }
  try { init_cropper(); } catch (e) { }
  try { init_knob(); } catch (e) { }
  try { init_IonRangeSlider(); } catch (e) { }
  try { init_ColorPicker(); } catch (e) { }
  try { init_TagsInput(); } catch (e) { }
  try { init_parsley(); } catch (e) { }
  try { init_daterangepicker(); } catch (e) { }
  try { init_daterangepicker_right(); } catch (e) { }
  try { init_daterangepicker_single_call(); } catch (e) { }
  try { init_daterangepicker_reservation(); } catch (e) { }
  try { init_SmartWizard(); } catch (e) { }
  try { init_EasyPieChart(); } catch (e) { }
  try { init_charts(); } catch (e) { }
  try { init_echarts(); } catch (e) { }
  try { init_morris_charts(); } catch (e) { }
  try { init_skycons(); } catch (e) { }
  try { init_select2(); } catch (e) { }
  try { init_validator(); } catch (e) { }
  try { init_DataTables(); } catch (e) { }
  try { init_chart_doughnut(); } catch (e) { }
  try { init_gauge(); } catch (e) { }
  try { init_PNotify(); } catch (e) { }
  try { init_starrr(); } catch (e) { }
  try { init_calendar(); } catch (e) { }
  try { init_compose(); } catch (e) { }
  try { init_CustomNotification(); } catch (e) { }
  try { init_autosize(); } catch (e) { }
  try { init_autocomplete(); } catch (e) { }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


var sourceUserCell;
var hierarchygraph;
function userHierarchyEditor() {

  // Checks if browser is supported
  if (!mxClient.isBrowserSupported()) {
    // Displays an error message if the browser is
    // not supported.
    mxUtils.error('Browser is not supported!', 200, false);
  }
  else {
    // Workaround for Internet Explorer ignoring certain styles

    var usercontainer = document.getElementById('editorGriduser');
    // container.style.position = 'absolute';
    // container.style.overflow = 'hidden';
    // container.style.left = '0px';
    // container.style.top = '0px';
    // container.style.right = '0px';
    // container.style.bottom = '0px';
    var useroutline = document.getElementById('outlineContaineruser');

    mxEvent.disableContextMenu(usercontainer);
    if (mxClient.IS_QUIRKS) {
      document.body.style.overflow = 'hidden';
      new mxDivResizer(usercontainer);
      new mxDivResizer(useroutline);

    }

    if (mxClient.IS_GC || mxClient.IS_SF) {
      usercontainer.style.background = '-webkit-gradient(linear, 0% 0%, 0% 100%, from(#FFFFFF), to(#E7E7E7))';
    }
    else if (mxClient.IS_NS) {
      usercontainer.style.background = '-moz-linear-gradient(top, #FFFFFF, #E7E7E7)';
    }
    else if (mxClient.IS_IE) {
      usercontainer.style.filter = 'progid:DXImageTransform.Microsoft.Gradient(' +
        'StartColorStr=\'#FFFFFF\', EndColorStr=\'#E7E7E7\', GradientType=0)';
    }
    // document.body.appendChild(container);
    // Creates the graph inside the given container
    hierarchygraph = new mxGraph(usercontainer);

    // Enables automatic sizing for vertices after editing and
    // panning by using the left mouse button.
    hierarchygraph.setCellsMovable(false);
    hierarchygraph.setConnectable(true);
    hierarchygraph.setAutoSizeCells(true);
    hierarchygraph.setPanning(true);
    hierarchygraph.centerZoom = false;
    hierarchygraph.panningHandler.useLeftButtonForPanning = true;
    // Displays a popupmenu when the user clicks
    // on a cell (using the left mouse button) but
    // do not select the cell when the popup menu
    // is displayed
    hierarchygraph.panningHandler.popupMenuHandler = false;
    // Creates the outline (navigator, overview) for moving
    // around the graph in the top, right corner of the window.
    var outln = new mxOutline(hierarchygraph, useroutline);

    // Disables tooltips on touch devices
    hierarchygraph.setTooltips(!mxClient.IS_TOUCH);




    // Set some stylesheet options for the visual appearance of vertices
    var style = hierarchygraph.getStylesheet().getDefaultVertexStyle();
    style[mxConstants.STYLE_SHAPE] = 'label';

    style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
    style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_LEFT;
    style[mxConstants.STYLE_SPACING_LEFT] = 54;

    //style[mxConstants.STYLE_GRADIENTCOLOR] = '#FFFFFF';
    style[mxConstants.STYLE_STROKECOLOR] = '#E3E3E3';
    style[mxConstants.STYLE_FILLCOLOR] = '#E3E3E3';

    style[mxConstants.STYLE_FONTCOLOR] = '#000000';
    style[mxConstants.STYLE_FONTFAMILY] = 'Raleway';
    style[mxConstants.STYLE_FONTSIZE] = '12';
    style[mxConstants.STYLE_FONTSTYLE] = '1';

    style[mxConstants.STYLE_SHADOW] = '1';
    style[mxConstants.STYLE_ROUNDED] = '1';
    style[mxConstants.STYLE_GLASS] = '0';

    style[mxConstants.STYLE_IMAGE] = './assets/js/mxGraph/images/dude3.png';
    style[mxConstants.STYLE_IMAGE_WIDTH] = '24';
    style[mxConstants.STYLE_IMAGE_HEIGHT] = '24';
    style[mxConstants.STYLE_SPACING] = 8;

    // Sets the default style for edges
    style = hierarchygraph.getStylesheet().getDefaultEdgeStyle();
    style[mxConstants.STYLE_ROUNDED] = true;
    style[mxConstants.STYLE_STROKEWIDTH] = 2;
    style[mxConstants.STYLE_EXIT_X] = 0.5; // center
    style[mxConstants.STYLE_EXIT_Y] = 1.0; // bottom
    style[mxConstants.STYLE_EXIT_PERIMETER] = 0; // disabled
    style[mxConstants.STYLE_ENTRY_X] = 0.5; // center
    style[mxConstants.STYLE_ENTRY_Y] = 0; // top
    style[mxConstants.STYLE_ENTRY_PERIMETER] = 0; // disabled

    // Disable the following for straight lines
    style[mxConstants.STYLE_EDGE] = mxEdgeStyle.TopToBottom;

    // Stops editing on enter or escape keypress
    var keyHandler = new mxKeyHandler(hierarchygraph);

    // Enables automatic layout on the graph and installs
    // a tree layout for all groups who's children are
    // being changed, added or removed.
    var userlayout = new mxCompactTreeLayout(hierarchygraph, false);
    userlayout.useBoundingBox = false;
    userlayout.edgeRouting = false;
    userlayout.levelDistance = 60;
    userlayout.nodeDistance = 16;

    // Allows the layout to move cells even though cells
    // aren't movable in the graph
    userlayout.isVertexMovable = function (cell) {
      return true;
    };

    var layoutMgr = new mxLayoutManager(hierarchygraph);

    layoutMgr.getLayout = function (cell) {
      if (cell.getChildCount() > 0) {
        return userlayout;
      }
    };

    // Installs a popupmenu handler using local function (see below).
    hierarchygraph.popupMenuHandler.factoryMethod = function (menu, cell, evt) {
      return createPopupMenuUser(hierarchygraph, menu, cell, evt);
    };



    // Fix for wrong preferred size
    var oldGetPreferredSizeForCell = hierarchygraph.getPreferredSizeForCell;
    hierarchygraph.getPreferredSizeForCell = function (cell) {
      var result = oldGetPreferredSizeForCell.apply(this, arguments);

      if (result != null) {
        result.width = Math.max(80, result.width);
      }

      return result;
    };

    hierarchygraph.convertValueToString = function (cell) {
      var data = cell.getValue();

      if (data) {
        try {
          if (data.userName) {
            return data.userName;
          }
        } catch (exception) {

        }

        return data;
      }

      return '';
    };


    // var content = document.createElement('div');
    // content.style.padding = '4px';

    // var tb = new mxToolbar(content);

    // tb.addItem('Zoom In', 'images/zoom_in32.png',function(evt)
    // {
    //   hierarchygraph.zoomIn();
    // });

    // tb.addItem('Zoom Out', 'images/zoom_out32.png',function(evt)
    // {
    //   hierarchygraph.zoomOut();
    // });

    // tb.addItem('Actual Size', 'images/view_1_132.png',function(evt)
    // {
    //   hierarchygraph.zoomActual();
    // });

    // tb.addItem('Print', 'images/print32.png',function(evt)
    // {
    //   var preview = new mxPrintPreview(hierarchygraph, 1);
    //   preview.open();
    // });

    // tb.addItem('Poster Print', 'images/press32.png',function(evt)
    // {
    //   var pageCount = mxUtils.prompt('Enter maximum page count', '1');

    //   if (pageCount != null)
    //   {
    //     var scale = mxUtils.getScaleForPageCount(pageCount, hierarchygraph);
    //     var preview = new mxPrintPreview(hierarchygraph, scale);
    //     preview.open();
    //   }
    // });

    // wnd = new mxWindow('Tools', content, 0, 0, 200, 66, false);
    // wnd.setMaximizable(false);
    // wnd.setScrollable(false);
    // wnd.setResizable(false);
    // wnd.setVisible(true);
    document.getElementById('#discardHierarchy').style.visibility = 'hidden';
    document.getElementById('#saveHierarchy').style.visibility = 'hidden';

  }
};



function addRootUserOrLoad(serverXml, user) {
  if (serverXml) {


    // Reads xml for graph obtained from server and renders it
    // 
    var doc = mxUtils.parseXml(serverXml);
    var codec = new mxCodec(doc);
    var users = []
    codec.decode(doc.documentElement, hierarchygraph.getModel());

    var allVertices = hierarchygraph.getChildVertices(hierarchygraph.getDefaultParent());
    for (var index = 0; index < allVertices.length; index++) {
      hierarchygraph.traverse(allVertices[index], true, function (vertex) {
        if (index == 0) {
          // To scroll graph so that our cell would appear in center
          hierarchygraph.scrollCellToVisible(vertex, true);

        }
        users.push(vertex.value);
        console.log(vertex)

        if (vertex.value.parentUserId) {
          addOverlaysUser(hierarchygraph, vertex, true);
        }
        else {
          addOverlaysUser(hierarchygraph, vertex, true);
        }

      });
    }

    if (users.length > 0) {
      document.getElementById('#rootuser').style.visibility = 'hidden';
      document.getElementById('#discardHierarchy').style.visibility = 'visible';
      document.getElementById('#saveHierarchy').style.visibility = 'visible';
    }
    window['userHierarchyRef'].zone.run(() => { window['userHierarchyRef'].component.updateUserListAfterAdd(users); })
  } else {


    if (user.companyId && user.companyId.length > 0) {

      var parentUser = hierarchygraph.getDefaultParent();

      // Adds the root vertex of the tree
      hierarchygraph.getModel().beginUpdate();

      try {
        var w1 = hierarchygraph.container.offsetWidth;
        var h1 = hierarchygraph.container.offsetHeight;
        var v2 = hierarchygraph.insertVertex(parentUser, "rootuser", user, w1 / 2 - 30, 20, 140, 60, 'image=./assets/js/mxGraph/images/dude3.png');
        hierarchygraph.updateCellSize(v2);
        addOverlaysUser(hierarchygraph, v2, true);

      }
      finally {
        // Updates the display
        hierarchygraph.getModel().endUpdate();
        var users = getUsersForAllVertices();
        window['userHierarchyRef'].zone.run(() => { window['userHierarchyRef'].component.updateUserListAfterAdd(users); })
        document.getElementById('#rootuser').style.visibility = 'hidden';
        document.getElementById('#discardHierarchy').style.visibility = 'visible';
        document.getElementById('#saveHierarchy').style.visibility = 'visible';
      }
    }
    else {
      window['userHierarchyRef'].zone.run(() => {
        window['userHierarchyRef'].component.
          showAppJSWarning("Please select a user first!!");
      });
      showModal("warningModal");
      return;
    }
  }
}




function discardGraph(userGraphObject) {

  var allVertices = hierarchygraph.getChildVertices(hierarchygraph.getDefaultParent());
  var rootcell;
  for (var index = 0; index < allVertices.length; index++) {
    hierarchygraph.traverse(allVertices[index], true, function (vertex) {
      if (index == 0) {
        // To scroll graph so that our cell would appear in center

        if (vertex.id === "rootuser") {
          rootcell = vertex
        }
      }
      deleteUserSubtree(hierarchygraph, rootcell);
      document.getElementById('#rootuser').style.visibility = 'visible';
      document.getElementById('#discardHierarchy').style.visibility = 'hidden';
      document.getElementById('#saveHierarchy').style.visibility = 'hidden';

      if (userGraphObject.xml.length > 0) {
        window['userHierarchyRef'].zone.run(() => { window['userHierarchyRef'].component.deleteUserGraph(userGraphObject); })
      }

    });
  }
}

// Function to create the entries in the popupmenu
function createPopupMenuUser(hierarchygraph, usermenu, cell, evt) {
  var model = hierarchygraph.getModel();
  console.log(cell)
  if (!isReadOnly && cell != null) {

    if (cell.id != 'rootuser' && cell.value && !(typeof cell.value === "string" || cell.value instanceof String)) {
      usermenu.addItem('Delete', './assets/js/mxGraph/images/delete.gif', function () {
        deleteUserSubtree(hierarchygraph, cell);
      });
    }
    usermenu.addItem('Edit', '', function () {
      try {
        if (model.isVertex(cell)) {
          sourceUserCell = cell;

          var user = cell.value;
          if (user && (typeof user === 'string' || user instanceof String)) {
            user = null;
          }
          var users = getUsersForAllVertices();
          window['userHierarchyRef'].zone.run(() => { window['userHierarchyRef'].component.updateUserListAfterAdd(users); })
          window['userHierarchyRef'].zone.run(() => { window['userHierarchyRef'].component.updateSelectedUser(user); })


          $("#userUpdateModal").modal();
        }
      } catch (exception) {
        // console.log(exception);
      }
    });

    usermenu.addSeparator();
  }

  usermenu.addItem('Fit', 'editors/images/zoom.gif', function () {
    hierarchygraph.fit();
  });

  usermenu.addItem('Actual', 'editors/images/zoomactual.gif', function () {
    hierarchygraph.zoomActual();
  });

  usermenu.addSeparator();

  usermenu.addItem('Print', 'editors/images/print.gif', function () {
    var preview = new mxPrintPreview(hierarchygraph, 1);
    preview.open();
  });

  usermenu.addItem('Poster Print', 'editors/images/print.gif', function () {
    var pageCount = mxUtils.prompt('Enter maximum page count', '1');

    if (pageCount != null) {
      var scale = mxUtils.getScaleForPageCount(pageCount, hierarchygraph);
      var preview = new mxPrintPreview(hierarchygraph, scale);
      preview.open();
    }
  });
};

function addOverlaysUser(hierarchygraph, cell, addDeleteIcon) {
  var overlay = new mxCellOverlay(new mxImage('./assets/js/mxGraph/images/add.png', 24, 24), 'Add child');
  overlay.cursor = 'hand';
  overlay.align = mxConstants.ALIGN_CENTER;
  overlay.addListener(mxEvent.CLICK, mxUtils.bind(this, function (sender, evt) {
    try {



      addUser(hierarchygraph, cell)
      sourceUserCell = cell

    }
    catch (exception) {
      // console.log(exception);
    }

  }));


  exportUserXml = function () {
    var encoder = new mxCodec();
    var node = encoder.encode(hierarchygraph.getModel());
    var xml = mxUtils.getXml(node);


    var users = getUsersForAllVertices();



    try {

      window['userHierarchyRef'].zone.run(() => { window['userHierarchyRef'].component.saveUserXml(xml, users); })

    } catch (exception) {
      // console.log(exception);
    }
  }


  getUsersForAllVertices = function () {
    var users = [];
    var vertices = hierarchygraph.getChildVertices(hierarchygraph.getDefaultParent());
    for (var vertex of vertices) {
      if (vertex != null && vertex.value != null && !(typeof vertex.value === 'string' || vertex.value instanceof String)) {
        users.push(vertex.value);
      }
    }

    return users;
  }

  saveUserObject = function (user) {

    if (user.companyId && user.companyId.length > 0) {
      var vertex = addChildUser(hierarchygraph, sourceUserCell, user);
    }
    else {
      window['userHierarchyRef'].zone.run(() => {
        window['userHierarchyRef'].component.
          showAppJSWarning("Please select a user first!!");
      });
      showModal("warningModal");
      return;
    }

  }


  alertMessage = function (message) {
    window['userHierarchyRef'].zone.run(() => {
      window['userHierarchyRef'].component.
        showAppJSWarning(message);
    });
    closeModal("warningModal");
    showModal("warningModal");
    return;

  }


  updateUserObject = function (user) {

    if (user.companyId && user.companyId.length > 0) {
      hierarchygraph.getModel().beginUpdate();
      try {
        sourceUserCell.setValue(user);
        hierarchygraph.getView().clear(sourceUserCell, false, false);
        hierarchygraph.getView().validate();
        hierarchygraph.cellSizeUpdated(sourceUserCell, false);
      }
      finally {
        hierarchygraph.getModel().endUpdate();
      }
    }
    else {
      window['userHierarchyRef'].zone.run(() => {
        window['userHierarchyRef'].component.
          showAppJSWarning("Please select a user first!!");
      });
      showModal("warningModal");
      return;
    }
  }

  // overlay.addListener(mxEvent.CLICK, mxUtils.bind(this, function(sender, evt)
  // {
  // addChildUser(hierarchygraph, cell);
  // }));

  hierarchygraph.addCellOverlay(cell, overlay);

  if (addDeleteIcon) {
    overlay = new mxCellOverlay(new mxImage('./assets/js/mxGraph/images/close.png', 30, 30), 'Delete');
    overlay.cursor = 'hand';
    overlay.offset = new mxPoint(-4, 8);
    overlay.align = mxConstants.ALIGN_RIGHT;
    overlay.verticalAlign = mxConstants.ALIGN_TOP;
    overlay.addListener(mxEvent.CLICK, mxUtils.bind(this, function (sender, evt) {
      if (cell.id === "rootuser") {
        document.getElementById('#rootuser').style.visibility = 'visible';
        document.getElementById('#discardHierarchy').style.visibility = 'hidden';
        document.getElementById('#saveHierarchy').style.visibility = 'hidden';

        window['userHierarchyRef'].zone.run(() => { window['userHierarchyRef'].component.discard(); })

      }
      deleteUserSubtree(hierarchygraph, cell);
      var users = getUsersForAllVertices();
      window['userHierarchyRef'].zone.run(() => { window['userHierarchyRef'].component.updateUserListAfterAdd(users); })
    }));

    hierarchygraph.addCellOverlay(cell, overlay);
  }
};


function getStateInfo(cell) {
  window['processAuditRef'].zone.run(() => { window['processAuditRef'].component.showStateInfo(cell); })

}

function addUser(hierarchygraph, cell) {
  try {

    let parentUser = cell.value;
    var users = getUsersForAllVertices();
    window['userHierarchyRef'].zone.run(() => { window['userHierarchyRef'].component.updateUserListAfterAdd(users); })
    window['userHierarchyRef'].zone.run(() => { window['userHierarchyRef'].component.addUser(null, parentUser); })
    $("#userModal").modal();


  }
  catch (exception) {
    // console.log(exception);
  }
}


function addChildUser(hierarchygraph, cell, user) {
  var model = hierarchygraph.getModel();
  var parentUser = hierarchygraph.getDefaultParent();
  var vertex;

  model.beginUpdate();
  try {
    var w1 = hierarchygraph.container.offsetWidth;
    var h1 = hierarchygraph.container.offsetHeight;
    vertex = hierarchygraph.insertVertex(parentUser, "", user, w1 / 2 - 30, 20, 140, 60, 'image=./assets/js/mxGraph/images/dude3.png');
    var geometry = model.getGeometry(vertex);
    if (sourceUserCell != null) {
      vertex.source = sourceUserCell;
    }

    // Updates the geometry of the vertex with the
    // preferred size computed in the graph
    var size = hierarchygraph.getPreferredSizeForCell(vertex);
    geometry.width = size.width;
    geometry.height = size.height;

    // Adds the edge between the existing cell
    // and the new vertex and executes the
    // automatic layout on the parent
    var edge = hierarchygraph.insertEdge(parentUser, null, '', cell, vertex);

    // Configures the edge label "in-place" to reside
    // at the end of the edge (x = 1) and with an offset
    // of 20 pixels in negative, vertical direction.
    edge.geometry.x = 1;
    edge.geometry.y = 0;
    edge.geometry.offset = new mxPoint(0, -20);

    addOverlaysUser(hierarchygraph, vertex, true);
  }
  finally {
    model.endUpdate();
  }

  return vertex;
};

function deleteUserSubtree(hierarchygraph, cell) {
  // Gets the subtree from cell downwards
  var cells = [];
  var users = []
  hierarchygraph.traverse(cell, true, function (vertex) {
    cells.push(vertex);
    users.push(vertex.value);
    return true;
  });
  window['userHierarchyRef'].zone.run(() => { window['userHierarchyRef'].component.updateUserListAfterDelete(users); })
  hierarchygraph.removeCells(cells);
};

addInfoOverlays = function (graph, orModels, type) {
  if (graph != null && graph.getModel() != null) {
    graph.getModel().beginUpdate();
    try {
      var vertices = graph.getChildVertices(graph.getDefaultParent());
      if (vertices != null) {
        for (var vertex of vertices) {
          if (vertex != null && vertex.id != null) {
            if (vertex.value.stateCd != null && orModels != null) {
              for (var model of orModels) {
                if (model.name === vertex.value.stateCd) {
                  var overlay = new mxCellOverlay(new mxImage('./assets/js/mxGraph/images/info.png', 18, 18), 'Information');
                  overlay.align = mxConstants.ALIGN_LEFT;
                  overlay.verticalAlign = mxConstants.ALIGN_TOP;

                  overlay.cursor = 'hand';
                  overlay.addListener(mxEvent.CLICK, mxUtils.bind(this, function (sender, evt) {
                    try {

                      var cell = evt.getProperty('cell')
                      for (var model of orModels) {
                        if (model.name == cell.value.stateCd) {
                          //showModal("infoModal")
                          if (type == "archive") {
                            window['taskDetailsRef'].zone.run(() => { window['taskDetailsRef'].component.storeModel(model); })
                            $("#infoModal").modal();
                          }
                          if (type == "design") {
                            window['flowComponentRef'].zone.run(() => { window['flowComponentRef'].component.storeModel(model); })
                            $("#infoModalDesign").modal();
                          }
                        }
                      }
                    }
                    catch (exception) {
                      // console.log(exception);
                    }

                  }));

                  graph.addCellOverlay(vertex, overlay);
                }
              }
            }
          }
        }
      }
    } finally {
      graph.getModel().endUpdate();
    }
  }
}






addTaskIconOverlays = function (graph) {
  if (graph != null && graph.getModel() != null) {
    graph.getModel().beginUpdate();
    try {
      var vertices = graph.getChildVertices(graph.getDefaultParent());
      if (vertices != null) {
        for (var vertex of vertices) {
          if (vertex != null && vertex.id != null) {
            if (vertex != null && vertex.value != null && !(typeof vertex.value === 'string' || vertex.value instanceof String)) {
              if (vertex.value.type != null && vertex.value.type == 'Manual') {
                var overlay = new mxCellOverlay(new mxImage('./assets/js/mxGraph/images/dude3.png', 18, 18), 'Manual Task');
                overlay.align = mxConstants.ALIGN_LEFT;
                overlay.verticalAlign = mxConstants.ALIGN_BOTTOM;
                graph.addCellOverlay(vertex, overlay);
              } else if (vertex.value.type != null && vertex.value.type == 'Auto') {
                var overlay = new mxCellOverlay(new mxImage('./assets/js/mxGraph/images/gear.png', 18, 18), 'Auto Task');
                overlay.align = mxConstants.ALIGN_LEFT;
                overlay.verticalAlign = mxConstants.ALIGN_BOTTOM;
                graph.addCellOverlay(vertex, overlay);
              } else if (vertex.value.stateCd != null && orModels != null) {

                var overlay = new mxCellOverlay(new mxImage('./assets/js/mxGraph/images/info.png', 18, 18), 'Information');
                overlay.align = mxConstants.ALIGN_LEFT;
                overlay.verticalAlign = mxConstants.ALIGN_BOTTOM;
                graph.addCellOverlay(vertex, overlay);
              }

            }
          }
        }
      }

    } finally {
      graph.getModel().endUpdate();
    }
  }
};

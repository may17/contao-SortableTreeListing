/**
 * @copyright  Joe Ray Gregory 2012
 * @author     Joe Ray Gregory <joe@.may17.de>
 * @license    LGPL
 */
var ContaoSortableTree = new Class({
    Implements: [Events, Options],
    options: {
        tlFilesItems: '.tl_listing .tl_file',
        droppables: ['.tl_listing .tl_file', '.tl_listing .tl_folder'],
        dragIcon: {
            data: {
                'src': 'system/modules/m17SortableTreeListing/html/img/icon/arrow-move.png',
                'alt': 'move',
                'class': 'movethis',
                'styles': {
                    'cursor': 'move'
                }
            },
            injectDestination: ['.tl_left a', 'before']
        }
    },
    initialize: function(options) {
        var self = this;
        this.setOptions(options);
        this.tlFilesItems = $$(this.options.tlFilesItems);
        this.addDragImage();
        this.setIdsAsData();
        this.tlFilesItems.addEvent('mousedown', function(event) {
            self.initDragAndDrop.apply(this, [event, self.options, self]);
        });

    },
    addDragImage: function() {
        var dragIcon = this.options.dragIcon,
            generateIcon = function(el) {
                if(!el.getElement('.tl_left img.movethis')) {
                    var moveItem = new Element('img', dragIcon.data);
                    moveItem.inject(el.getElement(dragIcon.injectDestination[0]) ,dragIcon.injectDestination[1]);
                }
            }

        this.tlFilesItems.each(generateIcon);
    }.protect(),
    setIdsAsData: function() {
        $$(this.options.droppables).each(function(el) {
            this.fileOrFolder(el,
                function() {
                    var url = new URI(el.getElement('.tl_right a').get('href'));
                    el.set('data-id', url.getData('id'));
                },
                function() {
                    var url = new URI(el.getElement('.tl_left a.tl_gray').get('href'));
                    el.set('data-id', url.getData('page'));
                }
            );
        }, this);
    }.protect(),
    fileOrFolder: function(el, fileFunc, FolderFunc) {
        var _r;
        if(el.hasClass('tl_file')) {
            _r = fileFunc;

        } else if(el.hasClass('tl_folder')) {
            _r = FolderFunc;
        }

        return _r();
    },
    initDragAndDrop: function(event, options, cthis) {
        event.stop();
        var $this = this;

        /* Check if the target has the class movethis */
        if(event.target.hasClass(options.dragIcon.data.class)) {
            var dragId = $this.get('data-id');

            /* generate a copy of the drag item */
            var shadow = $this.getElement('.tl_left').clone().setStyles(this.getCoordinates()).setStyles({
                opacity: 0.7,
                position: 'absolute'
            }).inject(document.body);

            var drag = new Drag.Move(shadow, {

                /* define drop areas */
                droppables: $$(options.droppables),

                onDrop: function(dragging, destination){
                    var dropId = destination.get('data-id'),
                        _padding,
                        _xhr;

                    dragging.destroy(); // destroy shadow
                    destination.setStyle('outline', 'none');
                    $this.inject(destination,'after');

                    _xhr = function(mode) {
                        var _req = new Request({
                            'url': 'contao/main.php?do=article&act=cut&mode='+mode+'&pid='+dropId+'&id='+dragId
                        });
                        _req.send();
                    }

                    _padding = destination.getElement('.tl_left').getStyle('paddingLeft').toInt();

                    cthis.fileOrFolder(destination, function() {
                        _xhr(1);
                    }, function() {
                        _xhr(2);
                        _padding += 40;
                    });


                    $this.getElement('.tl_left').setStyles({
                        'paddingLeft': _padding
                    });


                },
                onEnter: function(dragging, destination){
                    destination.setStyle('outline', '2px dotted #8AB858');
                },
                onLeave: function(dragging, destination){
                    destination.setStyle('outline', 'none');
                },
                onCancel: function(dragging){
                    dragging.destroy();
                }
            });

            drag.start(event);
        }
    }
});
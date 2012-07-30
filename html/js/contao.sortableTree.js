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
                'class': 'movethis'
            },
            injectDestination: ['.tl_left a', 'before']
        }
    },
    initialize: function(options) {
        this.setOptions(options);
        this.tlFilesItems = $$(this.options.tlFilesItems);
        this.addDragImage();
        this.setIdsAsData();
        this.initDragAndDrop();
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
    }.protect(),
    initDragAndDrop: function(event) {
        event.stop();
        $this = this;
        //TODO Refactoring Class with options
        /* Check if the target has the class movethis */
        if(event.target.hasClass('movethis')) {
            /* generate a copy of the drag item */
            var dragId = $this.get('data-id');

            var shadow = $this.getElement('.tl_left').clone().setStyles(this.getCoordinates()).setStyles({
                opacity: 0.7,
                position: 'absolute'
            }).inject(document.body);

            // hide m17 Tools
            //shadow.getElement('.rtz').setStyle('display', 'none');
            var drag = new Drag.Move(shadow, {

                /* define drop areas */
                droppables: $$('.tl_listing .tl_file', '.tl_listing .tl_folder'),


                onDrop: function(dragging, destination){
                    //var dragId = dragging.getParent().get('data-id');
                    //console.log(dragId);
                    var dropId = destination.get('data-id');
                    dragging.destroy(); // destroy shadow
                    destination.setStyle('outline', 'none');
                    $this.inject(destination,'after');
                    var _padding;
                    /* Save elements */
                    //var doRequest = function(mode,pid,id) {
                    if(destination.hasClass('tl_file')) {
                        var _xhr = new Request({
                            'url': 'http://cto.local/contao/main.php?do=article&act=cut&mode=1&pid='+dropId+'&id='+dragId
                        });
                        _xhr.send();
                    } else {
                        var _xhr = new Request({
                            'url': 'http://cto.local/contao/main.php?do=article&act=cut&mode=2&pid='+dropId+'&id='+dragId
                        });
                        _xhr.send();
                    }
                    //};

                    if(destination.hasClass('tl_folder')) {
                        _padding = destination.getElement('.tl_left').getStyle('paddingLeft').toInt() + 40;
                    } else {
                        _padding = destination.getElement('.tl_left').getStyle('paddingLeft').toInt();
                    }

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
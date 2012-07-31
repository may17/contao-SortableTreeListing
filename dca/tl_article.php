<?php if (!defined('TL_ROOT')) die('You cannot access this file directly!');

/**
 * Contao Open Source CMS
 * Copyright (C) 2005-2012 Leo Feyer
 *
 * Formerly known as TYPOlight Open Source CMS.
 *
 * This program is free software: you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this program. If not, please visit the Free
 * Software Foundation website at <http://www.gnu.org/licenses/>.
 *
 * PHP version 5
 * @copyright  Joe Ray Gregory 2012
 * @author     Joe Ray Gregory <http://www.may17.de>
 * @package    m17SortableTreeListing
 * @license    LGPL
 * @filesource
 */
$GLOBALS['TL_DCA']['tl_article']['config']['onload_callback'][] = array('m17SortableTreeListing', 'loadJs');

class m17SortableTreeListing extends tl_article
{
    public function loadJs()
    {
        $GLOBALS['TL_MOOTOOLS'][] = "
        <script>
            window.addEvents({
                'domready': function() {
                    new ContaoSortableTree();
                },
                'ajax_change': function() {
                    new ContaoSortableTree();
                }
            });
        </script>";
    }
}
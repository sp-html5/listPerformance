Ext.define('listPerformance.view.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'main',
    requires: [
        'Ext.TitleBar',
        'listPerformance.model.SharePointItem'
    ],
    config: {
        tabBarPosition: 'bottom',
        id: 'mainPanel',
        store: Ext.create('Ext.data.Store', {model: 'listPerformance.model.SharePointItem'}),

        items: [
            {
                title: 'Welcome',
                iconCls: 'home',
                id: 'listPanel',
                layout: 'fit'
            },
            {
                title: 'Settings',
                iconCls: 'settings',
                layout: 'fit',

                items: [
                    {
                        docked: 'top',
                        xtype: 'titlebar',
                        title: 'Settings'
                    },
                    {
                        xtype: 'formpanel',
                        items: {
                            xtype: 'fieldset',
                            defaults: {
                                labelWidth: '70%',
                                listeners: {
                                    change: function (src, value) {
                                        var mainPanel =  Ext.getCmp('mainPanel');
                                        localStorage[src.getName()] = value;
                                        mainPanel.loadStore();
                                        mainPanel.rebuildListcomponent()
                                    },
                                    scope: this
                                }
                            },
                            items: [
                                {
                                    xtype: 'togglefield',
                                    name: 'unifiedElements',
                                    label: 'Use unified elements',
                                    value: localStorage.unifiedElements
                                },
                                {
                                    xtype: 'textfield',
                                    name: 'itemCount',
                                    label: 'Items Count',
                                    value: localStorage.itemCount
                                }
                            ]
                        }
                    }
                ]
            }
        ]
    },

    initialize: function () {
        this.callParent(arguments);
        this.loadStore();
        this.rebuildListcomponent();
    },

    rebuildListcomponent: function () {
        var panel = this.down('#listPanel');
        panel.removeAll();
        panel.insertFirst(Ext.create('Ext.List', {
            id: 'performanceList',
            infinite: false,
            itemHeight: 80,
            itemTpl: localStorage.unifiedElements == '1' ? this.getUnifiedTpl() : this.getExpendedTpl(),
            store: this.getStore()
        }));
    },

    getUnifiedTpl: function () {
        return Ext.create('Ext.XTemplate',
            '<div class="{[this.getItemCls(values)]}">',
                '<span style="margin-left:50px">{title}</span>',
                '<div style="position:relative; left:80px; top: 12px; font-size: 14px;">{modifiedDate}</div>',
                '<div style="position:relative; left:257px; top: -3px; font-size: 14px;">{modifiedBy}</div>',
            '</div>',
            {
                getItemCls: function (values) {
                    var result = Ext.String.format('{0}-{1}', values.type, values.favorite ? 'favorite' : 'no-favorite');
                    if (values.checkout) {
                        result += '-checkout';
                    }

                    if (values.lockrecord) {
                        result += '-locked';
                    }

                    return result;
                }
            }
        )
    },

    getExpendedTpl: function () {
        return Ext.create('Ext.XTemplate',
            '<div>',
                '<div style="display: -webkit-box; -webkit-box-orient: horizontal; -webkit-box-align: center;">',
                    '<div class="list-item" style="-webkit-box-flex: 1;">',
                        '<div class="file-icon">',
                        '<div class="{type}Class">',
                        '<tpl if="favorite">',
                            '<div class="overlay tl-overlay favorite"></div>',
                        '</tpl>',
                        '<tpl if="checkout">',
                            '<div class="overlay br-overlay checkout"></div>',
                        '</tpl>',
                        '<tpl if="lockrecord">',
                            '<div class="overlay br-overlay lockrecord"></div>',
                        '</tpl>',
                    '</div>',
                '</div>',
                '<div class="itemDescription">',
                    '{title}',
                '</div>',
                '<div class="list-date-time" style="position:relative; left:60px; top: 12px; font-size: 14px;"><span style="position: relative; left: -23px;">{modifiedDate}</span></div>',
                '<div class="list-date-time" style="position:relative; left:180px; top: -2px; font-size: 14px;"><span style="position: relative; left: -23px;">{modifiedBy}</span></div>',

            '</div>'
        );
    },

    loadStore: function () {
        var fileRecords = [
                {type: 'doc', title: 'Review Document.doc', favorite: true, checkout: true, lockrecord: false, modifiedBy: 'John Smith', modifiedDate: '10/12/2010'},
                {type: 'email', title: 'Important email.eml', favorite: false, checkout: false, lockrecord: false, modifiedBy: 'John Smith', modifiedDate: '10/12/2010'},
                {type: 'pdf', title: 'Notes.pdf', favorite: true, checkout: false, lockrecord: false, modifiedBy: 'John Smith', modifiedDate: '10/12/2010'},
                {type: 'one', title: 'My Notes.one', favorite: true, checkout: false, lockrecord: false, modifiedBy: 'John Smith', modifiedDate: '10/12/2010'},
                {type: 'text', title: 'Draft.txt', favorite: true, checkout: false, lockrecord: false, modifiedBy: 'John Smith', modifiedDate: '10/12/2010'},
                {type: 'video', title: 'Great Movie.mov', favorite: true, checkout: false, lockrecord: true, modifiedBy: 'John Smith', modifiedDate: '10/12/2010'},
                {type: 'xls', title: 'Spreadsheet.xls', favorite: true, checkout: true, lockrecord: false, modifiedBy: 'John Smith', modifiedDate: '10/12/2010'},
                {type: 'ppt', title: 'Accounts.ppt', favorite: false, checkout: false, lockrecord: false, modifiedBy: 'John Smith', modifiedDate: '10/12/2010'}
            ],
            store = this.getStore(),
            aggregatedData = [],
            itemCount = +localStorage.itemCount || 600

        for (var i = 0; i < itemCount / fileRecords.length; ++i) {
            aggregatedData = aggregatedData.concat(fileRecords);
        }
        store.setData(aggregatedData);
    },

    setInfinite: function (isInfinite) {
        var list = this.down('list');
        list.setInfinite(isInfinite);
    }

});
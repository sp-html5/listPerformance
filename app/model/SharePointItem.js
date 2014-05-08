Ext.define('listPerformance.model.SharePointItem', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            { name: 'type', type: 'string' },
            { name: 'title', type: 'string' },
            { name: 'favorite', type: 'boolean' },
            { name: 'checkout', type: 'boolean' },
            { name: 'lockrecord', type: 'boolean' },
            { name: 'modifiedDate', type: 'string' },
            { name: 'modifiedBy', type: 'string' }
        ]
    }
});

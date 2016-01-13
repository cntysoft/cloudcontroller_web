/*
 * Cntysoft Cloud Software Team
 * 
 * @author Arvin <cntyfeng@163.com>
 * @copyright  Copyright (c) 2010-2015 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license   http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.ZhuChao.DeliveryOrderUse.Widget.Entry', {
   extend : 'WebOs.Kernel.ProcessModel.AbstractWidget',
   requires : [
      'Ext.util.KeyMap',
      'App.ZhuChao.DeliveryOrderUse.Comp.ImageGroup'
   ],
   mixins : {
      formTooltip : 'Cntysoft.Mixin.FormTooltip'
   },
   contextMenuRef : null,
   fileRefs : null,
   constructor : function (config)
   {
      config = config || {};
      this.fileRefs = [];
      this.mixins.formTooltip.constructor.call(this);
      this.callParent([config]);
   },
   initPmTextRef : function ()
   {
      this.pmText = this.GET_PM_TEXT('ENTRY');
   },
   initLangTextRef : function ()
   {
      this.LANG_TEXT = this.GET_LANG_TEXT('UI.ENTRY');
   },
   applyConstraintConfig : function (config)
   {
      this.callParent([config]);
      Ext.apply(config, {
         minWidth : 1000,
         minHeight : 500,
         resizable : false,
         bodyStyle : 'backgroud:#fff',
         maximizable : false,
         border : false,
         maximized : true
      });
   },
   initComponent : function ()
   {
      Ext.apply(this, {
         items : [
            this.getFormConfig()
         ]
      });
      this.addListener('afterrender', function (panel){
         this.douRef = panel;
      }, this);
      this.callParent();
   },
   getFormConfig : function ()
   {
      var FIELDS = this.LANG_TEXT.FIELDS, BTNS = this.LANG_TEXT.BTNS, MSG = this.LANG_TEXT.MSG;
      var R_STAR = Cntysoft.Utils.HtmlTpl.RED_STAR;
      return {
         xtype : 'form',
         bodyPadding : 10,
         autoScroll : true,
         defaults : {
            width : 500,
            labelWidth : 200,
            listeners : {
               afterrender : function (formItem)
               {
                  this.mixins.formTooltip.setupTooltipTarget.call(this, formItem);
               },
               scope : this
            }
         },
         items : [{
               xtype : 'combo',
               name : 'merchantId',
               fieldLabel : FIELDS.MERCHANT + R_STAR,
               fields : ['text', 'id'],
               allowBlank : false,
               store : this.createComboStore(),
               displayField : 'text',
               valueField : 'id',
               minChars : 1,
               listeners : {
                  focus : function (combo)
                  {
                     combo.expand();
                  },
                  afterrender : function(merchant)
                  {
                     this.merchantRef = merchant;
                  },
                  select : function(merchant, record)
                  {
                     this.legalPersonRef.setValue(record.get('legalPerson'));
                     this.authorizerRef.setValue(record.get('authorizer'));
                     this.addressRef.setValue(record.get('address'));
                  },
                  scope : this
               }
            },{
              xtype : 'textfield',
              name : 'legalPerson',
              editable : false,
              fieldLabel : FIELDS.LEGAL_PERSON + R_STAR,
              listeners : {
                 afterrender : function(merchant)
                  {
                     this.legalPersonRef = merchant;
                  },
                  scope : this
              }
            },{
              xtype : 'textfield',
              name : 'address',
              editable : false,
              fieldLabel : FIELDS.ADDRESS + R_STAR,
              listeners : {
                 afterrender : function(address)
                  {
                     this.addressRef = address;
                  },
                  scope : this
              }
            },{
              xtype : 'textfield',
              name : 'authorizer',
              fieldLabel : FIELDS.AUTHORIZER + R_STAR,
              allowBlank : false,
              listeners : {
                 afterrender : function(merchant)
                  {
                     this.authorizerRef = merchant;
                  },
                  scope : this
              }
            },{
               xtype : 'numberfield',
               name : 'totalPrice',
               fieldLabel : FIELDS.TOTAL_PRICE + R_STAR,
               allowBlank : false,
               minValue : 1,
               minText : MSG.PRICE_ERROR,
               listeners : {
                  afterrender : function (tp){
                     this.totalRef = tp;
                  },
                  change : function (tp, newValue){
                     var deletePrice = 0, realPrice = this.displayRef.getValue();
                     if(newValue){
                        this.dataGridRef.store.each(function (record){
                           deletePrice += parseInt(record.get('price'));
                        });
                        var parPrice = deletePrice;
                        if(0 == realPrice){
                           deletePrice = deletePrice * 0.8;
                        }else{
                           deletePrice = realPrice * 0.8;
                        }

                        this.parRef.setValue(parPrice);
                        this.deleteRef.setValue(deletePrice);
                     }
                     this.addRef.setDisabled(false);
                  },
                  scope : this
               }
            }, {
               xtype : 'textarea',
               name : 'goodsInfo',
               width : 905,
               height : 150,
               fieldLabel : FIELDS.GOODS_INFO
            }, {
               xtype : 'usercenterdeliveryorderusecompimagegroup',
               fieldLabel : FIELDS.ATTACH,
               editorRef : this,
               width : 905,
               listeners : {
                  afterrender : function (image){
                     this.attach = image;
                  },
                  scope : this
               }
            },
            this.getItemGridConfig(),
            {
               xtype : 'textfield',
               editable : false,
               fieldLabel : FIELDS.PAR_PRICE,
               fieldStyle : 'color : red; font-weight:bold',
               submitValue : false,
               value : 0,
               minValue : 0,
               listeners : {
                  afterrender : function (df){
                     this.parRef = df;
                  },
                  scope : this
               }
            }, {
               xtype : 'textfield',
               name : 'realPrice',
               minValue : 0,
               fieldLabel : FIELDS.REAL_PRICE,
               listeners : {
                  afterrender : function (df){
                     this.displayRef = df;
                  },
                  change : function(df, newValue)
                  {
                     var deletePrice = 0;
                     this.dataGridRef.store.each(function (record){
                        deletePrice += parseInt(record.get('price'));
                     });
                     var parPrice = deletePrice;
                     if(0 == newValue){
                        deletePrice = deletePrice * 0.8;
                     }else{
                        deletePrice = newValue * 0.8;
                     }

                     this.parRef.setValue(parPrice);
                     this.deleteRef.setValue(deletePrice);
                  },
                  scope : this
               }
            }, {
               xtype : 'textfield',
               editable : false,
               fieldLabel : FIELDS.DELETE_PRICE,
               fieldStyle : 'color : red; font-weight:bold',
               submitValue : false,
               value : 0,
               minValue : 0,
               listeners : {
                  afterrender : function (df){
                     this.deleteRef = df;
                  },
                  scope : this
               }
            }],
         buttons : [{
               text : BTNS.ADD_ORDER,
               listeners : {
                  click : this.saveHandler,
                  scope : this
               }
            }, {
               text : BTNS.CLOSE_ORDER,
               listeners : {
                  click : function (){
                     Cntysoft.showQuestionWindow(MSG.RESET, function (btn){
                        if('yes' == btn){
                           this.douRef.close();
                        } else{
                           return;
                        }
                     }, this);
                  },
                  scope : this
               }
            }],
         listeners : {
            afterrender : function (form){
               this.formRef = form;
            },
            scope : this
         }
      };
   },
   saveHandler : function ()
   {
      var MSG = this.LANG_TEXT.MSG;
      var form = this.formRef.getForm();
      if(form.isValid()){
         var values = form.getValues(), doList = [];
         if(!Ext.isNumber(values['merchantId'])){
            Cntysoft.showAlertWindow(MSG.MERCHANT_ERROR);
            return;
         }
         var realPrice = 0;
         this.dataGridRef.store.each(function (record){
            doList.push(record.get('number'));
            realPrice += record.get('price');
         });
         values['doList'] = doList;
         values['attach'] = this.attach.getFieldValue();
         values['price'] = realPrice;
         if(0 == values['realPrice']){
            values['realPrice'] = realPrice;
         }
         
         values['fileRefs'] = this.fileRefs; 

         Cntysoft.showQuestionWindow(MSG.READY, function (btn){
            if('yes' == btn){
               this.setLoading(MSG.ADDING);
               this.appRef.addOrder(values, function (response){
                  this.loadMask.hide();
                  if(!response.status){
                     Cntysoft.Kernel.Utils.processApiError(response);
                  } else{
                     Cntysoft.showAlertWindow(Ext.String.format(MSG.ADD_SUCCESS, values['totalPrice'], this.parRef.getValue(), values['realPrice'], this.deleteRef.getValue()), function (){
                        this.douRef.close();
                     }, this);
                  }
               }, this);
            } else{
               return;
            }
         }, this);
      }

   },
   createComboStore : function ()
   {
      return new Ext.data.Store({
         autoLoad : true,
         fields : [
            {name : 'id', type : 'integer', persist : false},
            {name : 'text', type : 'string', persist : false},
            {name : 'legalPerson', type : 'string', persist : false},
            {name : 'authorizer', type : 'string', persist : false}
         ],
         proxy : {
            type : 'apigateway',
            callType : 'App',
            invokeMetaInfo : {
               module : 'ZhuChao',
               name : 'DeliveryOrderUse',
               method : 'Mgr/getMerchantList'
            },
            reader : {
               type : 'json',
               rootProperty : 'items',
               totalProperty : 'total'
            }
         }
      });
   },
   getItemGridConfig : function ()
   {
      var GRID = this.LANG_TEXT.FIELDS;
      var BTNS = this.LANG_TEXT.BTNS;
      return {
         xtype : 'fieldcontainer',
         fieldLabel : GRID.COLLECTION,
         items : [{
               xtype : 'grid',
               height : 250,
               width : 700,
               autoScroll : true,
               border : false,
               toolTipText : this.LANG_TEXT.T_TEXT.GRID,
               style : 'border : 1px solid #CCC',
               emptyText : GRID.EMPTY,
               columns : [
                  {text : GRID.PRICE, dataIndex : 'price', flex : 1, menuDisabled : true, resizable : false, sortable : false},
                  {text : GRID.NO, dataIndex : 'number', flex : 1, menuDisabled : true, resizable : false, sortable : false},
                  {text : GRID.CODE, dataIndex : 'code', flex : 1, menuDisabled : true, resizable : false, sortable : false},
                  {text : GRID.STATUS, dataIndex : 'status', flex : 1, menuDisabled : true, resizable : false, sortable : false, renderer : Ext.bind(this.statusRender, this)}
               ],
               store : new Ext.data.Store({
                  fields : [
                     {name : 'number', type : 'string', persist : false},
                     {name : 'code', type : 'string', persist : false},
                     {name : 'status', type : 'integer', persist : false},
                     {name : 'price', type : 'integer', persist : false}
                  ]
               }),
               listeners : {
                  itemcontextmenu : this.gridItemContextClickHandler,
                  afterrender : function (grid)
                  {
                     this.dataGridRef = grid;
                  },
                  scope : this
               }
            }, {
               xtype : 'fieldcontainer',
               items : {
                  xtype : 'button',
                  disabled : true,
                  text : BTNS.ADD_NEW,
                  listeners : {
                     afterrender : function (btn){
                        this.addRef = btn;
                     },
                     click : this.addNewItemHandler,
                     scope : this
                  }
               },
               margin : '4 0 0 0'
            }]
      };
   },
   addNewItemHandler : function ()
   {
      var FIELDS = this.LANG_TEXT.FIELDS, RE_TEXT = this.LANG_TEXT.REGEX_TEXT, BTNS = this.LANG_TEXT.BTNS, MSG = this.LANG_TEXT.MSG;
      return new Ext.window.Window({
         title : FIELDS.WIN_TITLE,
         autoShow : true,
         modal : true,
         id : 'delivery-order-x-window',
         bodyPadding : 10,
         items : [{
               xtype : 'form',
               items : [{
                     xtype : 'textfield',
                     fieldLabel : FIELDS.NO,
                     name : 'number',
                     regex : new RegExp('^[0-9]{6}$'),
                     regexText : RE_TEXT.NO,
                     allowBlank : false,
                     listeners : {
                        afterrender : function(num){
                           this.number = num;
                           num.focus();
                        },
                        scope : this
                     }
                  }, {
                     xtype : 'textfield',
                     fieldLabel : FIELDS.CODE,
                     name : 'code',
                     regex : new RegExp('^[0-9]{6}$'),
                     regexText : RE_TEXT.CODE,
                     allowBlank : false
                  }, {
                  text : BTNS.ADD,
                  hidden : true,
                  listeners : {
                     afterrender : function(btn){
                        this.addBtn = btn;
                     },
                     click : function (){
                        var form = this.doWinRef.down('form');
                        if(form.isValid()){
                           var values = form.getValues();
                           this.setLoading(MSG.CHECKING);
                           this.appRef.getDeliveryOrder(values, function (response){
                              this.loadMask.hide();
                              if(!response.status){
                                 Cntysoft.Kernel.Utils.processApiError(response, this.LANG_TEXT.ERROR_TYPE);
                              } else{
                                 var data = response.data;
                                 var totalPrice = this.totalRef.getValue(), deletePrice = 0;
                                 if(2 == data.status){
                                    Cntysoft.showAlertWindow(MSG.USED);
                                    return;
                                 }
                                 if(3 == data.status){
                                    Cntysoft.showAlertWindow(MSG.INVALID);
                                    return;
                                 }
                                 var flag = true;
                                 this.dataGridRef.store.each(function (record){
                                    if(data.number == record.get('number') && data.code == record.get('code')){
                                       flag = false;
                                    }
                                 });
                                 
                                 Cntysoft.showQuestionWindow(MSG.ADD, function(btn){
                                    if('yes' == btn){
                                       if(flag){
                                          this.dataGridRef.store.add(data);
                                          Cntysoft.showAlertWindow(MSG.SUCCESS);
                                       }else{
                                          Cntysoft.showAlertWindow(MSG.ADDED);
                                       }
                                       
                                       if(totalPrice){
                                          var realPrice = this.displayRef.getValue();
                                          this.dataGridRef.store.each(function (record){
                                             deletePrice += parseInt(record.get('price'));
                                          });
                                          var parPrice = deletePrice;
                                          if(0 == realPrice){
                                             deletePrice = deletePrice * 0.8;
                                          }else{
                                             deletePrice = realPrice * 0.8;
                                          }

                                          this.parRef.setValue(parPrice);
                                          this.deleteRef.setValue(deletePrice);
                                       }
                                       
                                       form.getForm().reset();
                                    }
                                 }, this);
                              }
                           }, this);
                        }
                     },
                     scope : this
                  }
               }, {
                  text : BTNS.CLOSE,
                  hidden : true,
                  listeners : {
                     click : function (){
                        this.doWinRef.close();
                     },
                     scope : this
                  }
               }]
            }],
         listeners : {
            afterrender : function (win){
               this.doWinRef = win;
               var map = new Ext.util.KeyMap({
                  target: Ext.get('delivery-order-x-window'), // Ext.getBody(),
                  key: Ext.event.Event.ENTER,
                  fn: function(){
                     this.addBtn.fireEvent('click');
                     this.number.focus();
                  },
                  scope : this
              });
            },
            scope : this
         }
      });
   },

   gridItemContextClickHandler : function (gr, record, item, index, event)
   {
      var MENU = this.LANG_TEXT.MENU;
      if(null == this.contextMenuRef){
         this.contextMenuRef = new Ext.menu.Menu({
            ignoreParentClicks : true,
            items : [{
                  text : MENU.DELETE
               }],
            listeners : {
               click : this.menuItemClickHandler,
               scope : this
            }
         });
      }

      this.contextMenuRef.record = record;
      var pos = event.getXY();
      event.stopEvent();
      this.contextMenuRef.showAt(pos[0], pos[1]);
   },
   menuItemClickHandler : function (menu, item)
   {
      this.dataGridRef.store.remove(menu.record);
      var deletePrice = 0, realPrice = this.displayRef.getValue();
      this.dataGridRef.store.each(function (record){
         deletePrice += parseInt(record.get('price'));
      });
      var parPrice = deletePrice;
      if(0 == realPrice){
         deletePrice = deletePrice * 0.8;
      }else{
         deletePrice = realPrice * 0.8;
      }
      this.parRef.setValue(parPrice);
      this.deleteRef.setValue(deletePrice);
   },
   statusRender : function (value)
   {
      var STATUS = this.LANG_TEXT.STATUS;
      if(1 == value){
         return STATUS.UN_USED;
      } else if(2 == value){
         return STATUS.USED;
      }
   },
   destroy : function ()
   {
      if(this.contextMenuRef){
         this.contextMenuRef.destroy();
         delete this.contextMenuRef;
      }
      delete this.douRef;
      delete this.totalRef;
      delete this.displayRef;
      delete this.deleteRef;
      delete this.formRef;
      delete this.dataGridRef;
      this.callParent();
   }
});


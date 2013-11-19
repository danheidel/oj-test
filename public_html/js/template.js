oj.use(function(oj, settings){
  var Tree = oj.createType('Tree',{
    base:View,
    constructor: function(){
      var _t = this,
          _parentBase,
          uA = oj.unionArguments(arguments),
          options = uA.options,
          args = uA.args, //declarative element construction
          items;
      this.el = oj(function(){return oj.div();}); //use div as root elem by default
      if(isDefined(options.el)){
        this.el = aS(options, 'el');
      }
      oj.Tree.base.constructor(this, options);
    },
    properties:{
      items:{
        get:function(){
          if(isDefined(this._items)){
            return this._items;
          }else{return this.$items.ojValues();}
        },
        set:function(v){
          this._items = v;
          this.make();
        }
      },
      count:{get: function(){return this.$items.length;}},
      methods:{
        
      },
    },
  });
  
  var FoundationTitleBar = oj.createType(
    'FoundationTitleBar',{
    base:oj.View,
    constructor:function(){
      var _t = this,
          uA = oj.unionArguments(arguments),
          aS = oj.argumentShift,
          options = uA.options,
          args = uA.args,
          titleBarOptions = {},
          mainArea,
          leftArea, rightArea,
          _sticky;
      //strip off titleBar arguments
      titleBarOptions.title = aS(options, 'title');
      titleBarOptions.mobile = aS(options, 'mobile');
      this.sticky = aS(options, 'sticky');
      
      this.el = oj(function(){
        oj.div(function(){
          oj.nav({c:'top-bar'}, function(){
            oj.BarTitleArea(titleBarOptions);
            mainArea = oj.section({c:'top-bar-section'});
          });
        });
      });
      
      if(!oj.isDefined(this.sticky) || this.sticky == null || this.sticky == false){
        this.$el.removeClass('sticky');
      }else if(this.sticky == true){
        this.$el.addClass('sticky');
      }
      
      args.forEach(function(element){
          //this.push(oj._a(element));
        }, this);
      
      FoundationTitleBar.base.constructor.call(this, options);
    },
  });
  
  var BarTitleArea = oj.createType(
    'BarTitleArea',{
      base:oj.View,
      constructor:function(){
        var _t = this,
            uA = oj.unionArguments(arguments),
            aS = oj.argumentShift,
            options = uA.options,
            args = uA.args,
            _title, _mobile;
        this.el = oj(function(){
          oj.ul({c:'title-area'}, function(){
            oj.li({c:'name'});
            oj.li({c:'toggle-topbar'}, function(){
              oj.a({href:''});
            });
          });
        });
        this.title = aS(options, 'title');
        this.mobile = aS(options, 'mobile');
        BarTitleArea.base.constructor.call(this, options);
      },
      properties:{
        title:{ //.name is displayed name of menu, .href is the optional addr of clicking on the title
          get:function(){return this._title;},
          set: function(val){
            this._title = val;
            if(val === null || typeof val === 'undefined' || 
               (typeof val.name === 'undefined')){
              this.$el.children('li:first-child').empty();
            }else{
              this.$el.children('li:first-child').oj(function(){
                oj.h1(function(){
                  if(typeof val.href === 'undefined'){
                    oj.a(val.name);
                  }else{
                    oj.a(val.name, {href:val.href});
                  }
                });
              });
            }
          }
        },
        mobile:{ // .name - optional mobile menu bar name .icon - boolean for presence of mobile menu icon, .href is the optional addr when clicking on the mobile menu bar
          get:function(){return this._mobile},
          set:function(val){
            this._mobile = val;
            if(val === null || typeof val === 'undefined'){
              this.$el.children('li:nth-child(2)').ojReplaceWith(function(){
                li({class:'toggle-topbar'}, function(){
                  a({href:''});
                });
              });
            }else{ //val is at least defined
              var toggleLi = this.$el.children('li:nth-child(2)');
              if(typeof val.icon ==='undefined' || val.icon === false){
                toggleLi.removeClass('menu-icon');
              }else if(val.icon === true){
                toggleLi.addClass('menu-icon');
              }
              if(typeof val.href === 'undefined' || val.href === null || val.href === ''){
                toggleLi.children('a:first-child').attr('href', '');
              }else{
                toggleLi.children('a:first-child').attr('href', val.href);
              }
              if(typeof val.name === 'undefined' || val.name === null || val.name === ''){
                toggleLi.children('a:first-child').oj(function(){
                  span();
                });
              }else{
                toggleLi.children('a:first-child').oj(function(){
                  span(val.name);
                });
              }
            }
          }
        }
      }
    }
  );
  
  var BarMainArea = oj.createType(
    'BarMainArea',{
    base:oj.List,
    constructor:function(){
      var _t = this,
          uA = oj.unionArguments(arguments),
          aS = oj.argumentShift,
          options = uA.options,
          args = uA.args,
          _tagType, _tagClass, _itemTagClass;
      //this.el = oj(function(){});
      this.tagType = aS(options, 'tagType');
      this.tagClass = aS(options, 'tagClass');
      this.itemTagClass = aS(options, 'itemTagClass');
      BarMainArea.base.constructor.call(this, {tagName:'ul', itemTagName:'li'});
      
      if(typeof this.tagType === 'undefined' || this.tagType === null || this.tagType == 'dropdown'){
        this.$el.removeClass('left right').addClass('dropdown');
      }else if(this.tagType == 'left'){
        this.$el.removeClass('right dropdown').addClass('left');
      }else if(this.tagType == 'right'){
        this.$el.removeClass('left dropdown').addClass('right');
      }
      
      args.forEach(function(element){
        if(element == '-'){
          this.push('');
          this.$item(this.count - 1).addClass('divider');
        }else{
          this.push(oj._a(element));
          if(isDefined(this.itemTagClass)){this.$item(this.count - 1).addClass(this.itemTagClass);}
          if(element.typeName == 'BarMainArea'){this.$item(this.count-1).addClass('has-dropdown');}
        };
      }, this);
    },
  });
  
    
  return {FoundationTitleBar:FoundationTitleBar, BarTitleArea:BarTitleArea, BarMainArea:BarMainArea};
});
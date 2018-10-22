# 项目简介
这个一个基于 web 的用来读取 rss 源的应用。我在已开发完成的项目中加入了 [Jasmine](http://jasmine.github.io) 测试框架。现有4组测试套件共7个测试用例。如下图：<br />
![订阅阅读器界面](https://github.com/JuniorYoung/Udacity-FeedReaderTesting/raw/master/images/RM_1.png)

# 测试套件说明
1. RSS Feeds
  * are defined  //测试`allFeeds`变量是否已声明
  * each feed'url is defined //测试`allFeeds`对象里面的所有的元素包含链接字段而且链接不是空的
  * each feed'name is defined //测试`allFeeds`对象里面的所有的元素包含名字字段而且不是空的
2. The menu
  * the menu is hidden by default //确保菜单元素在页面初次加载时是隐藏的
  * when the menu icon is clicked, the menu will change visibility //确保当菜单图标被点击的时候菜单会切换可见状态
3. Initial Entries
  * after loadFeed is called, the FEED container has at least one ENTRY element //确保`loadFeed`函数在页面初次加载时被调用而且工作正常，即在 `.feed` 容器元素里面至少有一个 `.entry` 的元素
4. New Feed Selection
  * when loadFeed is called, the FEED container's article will change //确保当用 `loadFeed` 函数加载一个新源的时候内容会真的改变

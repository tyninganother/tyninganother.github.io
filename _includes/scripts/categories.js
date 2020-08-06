(function () {
    var SOURCES = window.TEXT_VARIABLES.sources;

    function queryString() {
        // This function is anonymous, is executed immediately and
        // the return value is assigned to QueryString!
        var i = 0, queryObj = {}, pair;
        var queryStr = window.location.search.substring(1);
        var queryArr = queryStr.split('&');
        for (i = 0; i < queryArr.length; i++) {
            pair = queryArr[i].split('=');
            // If first entry with this name
            if (typeof queryObj[pair[0]] === 'undefined') {
                queryObj[pair[0]] = pair[1];
                // If second entry with this name
            } else if (typeof queryObj[pair[0]] === 'string') {
                queryObj[pair[0]] = [queryObj[pair[0]], pair[1]];
                // If third or later entry with this name
            } else {
                queryObj[pair[0]].push(pair[1]);
            }
        }
        return queryObj;
    }

    window.Lazyload.js(SOURCES.jquery, function () {
        var $tags = $('.js-tags');
        var $result = $('.js-result');
        var $sections = $result.find('section');
        var sectionArticles = [];
        var sectionTopArticleIndex = [];
        var hasInit = false;

        $sections.each(function () {
            sectionArticles.push($(this).find('.item'));
        });

        function init() {
            var i, index = 0;
            for (i = 0; i < $sections.length; i++) {
                sectionTopArticleIndex.push(index);
                index += $sections.eq(i).find('.item').length;
            }
            sectionTopArticleIndex.push(index);
        }

        function tagSelect(categories/*raw tag*/) {
            if (categories) {
              var result = {}, $articles;
              var i, j, k;
              // 所有文章的显示
              for (i = 0; i < sectionArticles.length; i++) {
                $articles = sectionArticles[i];
                for (j = 0; j < $articles.length; j++) {
                  if (categories === '' || categories === undefined) {
                    result[i] || (result[i] = {});
                    result[i][j] = true;
                  } else {
                    var tags = $articles.eq(j).data('categories').split(',');
                    for (k = 0; k < tags.length; k++) {
                      if (tags[k] === categories) {
                        result[i] || (result[i] = {});
                        result[i][j] = true;
                        break;
                      }
                    }
                  }
                }
              }
              // 控制某类文章显示
              for (i = 0; i < sectionArticles.length; i++) {
                result[i] && $sections.eq(i).removeClass('d-none');
                result[i] || $sections.eq(i).addClass('d-none');
                for (j = 0; j < sectionArticles[i].length; j++) {
                  if (result[i] && result[i][j]) {
                    sectionArticles[i].eq(j).removeClass('d-none');
                  } else {
                    sectionArticles[i].eq(j).addClass('d-none');
                  }
                }
              }
              hasInit || ($result.removeClass('d-none'), hasInit = true);
            }
        }

        var query = queryString(), _categories = query.categories;
        init();
        tagSelect(_categories);


    });
})();

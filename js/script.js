let films = new Vue({
        el: '.container',
        data: {
            film: [],  //存放当前页的电影信息
            totalPage: 0,//总页数
            buttons: 5, //分页的数字按钮数
            pageArr: [], //存放页码及被点击的属性
            nowPage: 0, //当前页
            toPage:1  //跳到某页
        },
        created: function() {
            this.thisPage(1)
        },
        methods: {
            thisPage: function(index) {
                this.film = []
                const count = 25
                let i = (index - 1) * count + 1  //i为电影排名
                let start = (index - 1) * count
                this.pageArr = []
                this.nowPage = index
                this.pageArray()
                if (index === 1) {
                    this.pageArr[0].isActive = true
                }
                this.pageArr.map(function(x) {
                    if (x.page === index) {
                        x.isActive = true
                    }
                })
				$.ajax({  
					type: "get",
					url: 'http://api.douban.com/v2/movie/top250?start=' + start + '&count=' + count,
					dataType: "jsonp"
				})
				.done(function(response){
                    films.totalPage = response.total / count
                    response.subjects.map(function(x) {
                        films.film.push({
                            ranking: i++,
							src:x.images.large,
							name:x.title,
							ename:x.original_title,
							genres:x.genres,
							year:x.year,
							cast:x.casts,
							director:x.directors,
							average:x.rating.average,
							url:x.alt,
							top:0
                        })
                    })
                })
            },
            pageArray: function() {
                if (this.nowPage < 3) {
                    for (let i = 1; i <= 5; i++) {
                        this.pageArr.push({
                            page: i,
                            isActive: false
                        })
                    }
                } else if (this.nowPage < this.totalPage - 2) {
                    for (let i = this.nowPage - 2; i <= this.nowPage + 2; i++) {
                        this.pageArr.push({
                            page: i,
                            isActive: false
                        })
                    }
                } else {
                    for (let i = this.totalPage - this.buttons + 1; i <= this.totalPage; i++) {
                        this.pageArr.push({
                            page: i,
                            isActive: false
                        })
                    }
                }
            },
            nextPage: function() {
                let pageThis = parseInt($('.active').html())
                if (pageThis < this.totalPage) {
                    this.thisPage(pageThis + 1)
                }
            },
            prevPage: function() {
                let pageThis = parseInt($('.active').html())
                if (pageThis > 1) {
                    this.thisPage(pageThis - 1)
                }
            },
            gotoPage: function() {
                let p = this.toPage
                if (p >= 1 && p <= this.totalPage) {
                    this.thisPage(parseInt(p))
                    this.toPage = parseInt(p)
                }
            }
        }
    })
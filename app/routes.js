// Routes

var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    host: 'https://search-elasticengine-kbo7lvgosgrnzvlijimb2c4lk4.us-east-1.es.amazonaws.com',
    log: 'trace'
});

module.exports = function(app) {
    var recId = 0;

    app.get('/', function(req, res) {
        res.render('index.ejs', {
            posts: posts
        });
    });

    app.post('/getRecs', function(req, res) {
        if (req.body) {
            recId = req.body.postClicked;
            res.status(200).send();
        }
    });

    app.get('/showRecs', function(req, res) {
        var filteredPost = filteredPosts[recId];
        var query = filteredPost["text"];
        if (filteredPost["code"]) {
            query += " " + filteredPost["code"];
        }

        client.search({
            index: 'aw-rec-engine',
            size: 10,
            body: {
                "query": {
                    "multi_match": {
                        "query": query,
                        "fields": [
                            "html",
                            "title",
                            "url"
                        ]
                    }
                }
            }
        }).then(function (resp) {
            var hits = resp.hits.hits;
            res.render('recommendations.ejs', {
                recs: hits
            });
        }, function (err) {
            console.trace(err.message);
        });
    });

};

var stopWords = 'a,able,about,above,according,accordingly,across,actually,after,afterwards,again,against,all,allow,allows,almost,alone,along,already,also,although,always,am,among,amongst,an,and,another,any,anybody,anyhow,anyone,anything,anyway,anyways,anywhere,apart,appear,appreciate,appropriate,are,around,as,aside,ask,asking,associated,at,available,away,awfully,b,be,became,because,become,becomes,becoming,been,before,beforehand,behind,being,believe,below,beside,besides,best,better,between,beyond,both,brief,but,by,c,came,can,cannot,cant,cause,causes,certain,certainly,changes,clearly,co,com,come,comes,concerning,consequently,consider,considering,contain,containing,contains,corresponding,could,course,currently,d,definitely,described,despite,did,different,do,does,doing,done,down,downwards,during,e,each,edu,eg,eight,either,else,elsewhere,enough,entirely,especially,et,etc,even,ever,every,everybody,everyone,everything,everywhere,ex,exactly,example,except,f,far,few,fifth,first,five,followed,following,follows,for,former,formerly,forth,four,from,further,furthermore,g,get,gets,getting,given,gives,go,goes,going,gone,got,gotten,greetings,h,had,happens,hardly,has,have,having,he,hello,help,hence,her,here,hereafter,hereby,herein,hereupon,hers,herself,hi,him,himself,his,hither,hopefully,how,howbeit,however,i,ie,if,ignored,immediate,in,inasmuch,inc,indeed,indicate,indicated,indicates,inner,insofar,instead,into,inward,is,it,its,itself,j,just,k,keep,keeps,kept,know,knows,known,l,last,lately,later,latter,latterly,least,less,lest,let,like,liked,likely,little,look,looking,looks,ltd,m,mainly,many,may,maybe,me,mean,meanwhile,merely,might,more,moreover,most,mostly,much,must,my,myself,n,name,namely,nd,near,nearly,necessary,need,needs,neither,never,nevertheless,new,next,nine,no,nobody,non,none,noone,nor,normally,not,nothing,novel,now,nowhere,o,obviously,of,off,often,oh,ok,okay,old,on,once,one,ones,only,onto,or,other,others,otherwise,ought,our,ours,ourselves,out,outside,over,overall,own,p,particular,particularly,per,perhaps,placed,please,plus,possible,presumably,probably,provides,q,que,quite,qv,r,rather,rd,re,really,reasonably,regarding,regardless,regards,relatively,respectively,right,s,said,same,saw,say,saying,says,second,secondly,see,seeing,seem,seemed,seeming,seems,seen,self,selves,sensible,sent,serious,seriously,seven,several,shall,she,should,since,six,so,some,somebody,somehow,someone,something,sometime,sometimes,somewhat,somewhere,soon,sorry,specified,specify,specifying,still,sub,such,sup,sure,t,take,taken,tell,tends,th,than,thank,thanks,thanx,that,thats,the,their,theirs,them,themselves,then,thence,there,thereafter,thereby,therefore,therein,theres,thereupon,these,they,think,third,this,thorough,thoroughly,those,though,three,through,throughout,thru,thus,to,together,too,took,toward,towards,tried,tries,truly,try,trying,twice,two,u,un,under,unfortunately,unless,unlikely,until,unto,up,upon,us,use,used,useful,uses,using,usually,uucp,v,value,various,very,via,viz,vs,w,want,wants,was,way,we,welcome,well,went,were,what,whatever,when,whence,whenever,where,whereafter,whereas,whereby,wherein,whereupon,wherever,whether,which,while,whither,who,whoever,whole,whom,whose,why,will,willing,wish,with,within,without,wonder,would,would,x,y,yes,yet,you,your,yours,yourself,yourselves,z,zero,i,there,it,you';
var stopWordSet = new Set(stopWords.split(','));

function removeStopWords(str) {
    var wordSet = new Set(
        str.match(/\w+/ig).filter(function (word) {
            return !stopWordSet.has(word.toLowerCase());
        })
    );

    filteredString = '';
    wordSet.forEach(function (word) {
        filteredString += word + ' ';
    });

    return filteredString;
}

var p0 = {
    'type': 'question',
    'text': 'I was presented with this question in an end of module open book exam today and found myself lost. i was reading Head first Javaand both definitions seemed to be exactly the same. i was just wondering what the MAIN difference was for my own piece of mind. i know there are a number of similar questions to this but, none i have seen which provide a definitive answer.Thanks, Darren',
    'code': null
};

var p1 = {
    'type': 'answer accepted-answer',
    'text': 'Inheritance is when a \'class\' derives from an existing \'class\'.So if you have a Person class, then you have a Student class that extends Person, Student inherits all the things that Person has.There are some details around the access modifiers you put on the fields/methods in Person, but that\'s the basic idea.For example, if you have a private field on Person, Student won\'t see it because its private, and private fields are not visible to subclasses.Polymorphism deals with how the program decides which methods it should use, depending on what type of thing it has.If you have a Person, which has a read method, and you have a Student which extends Person, which has its own implementation of read, which method gets called is determined for you by the runtime, depending if you have a Person or a Student.It gets a bit tricky, but if you do something likePerson p = new Student();p.read();the read method on Student gets called.Thats the polymorphism in action.You can do that assignment because a Student is a Person, but the runtime is smart enough to know that the actual type of p is Student.Note that details differ among languages.You can do inheritance in javascript for example, but its completely different than the way it works in Java.',
    'code': null
};

var p2 = {
    'type': 'answer',
    'text': 'Polymorphism: The ability to treat objects of different types in a similar manner.Example: Giraffe and Crocodile are both Animals, and animals can Move.If you have an instance of an Animal then you can call Move without knowing or caring what type of animal it is.Inheritance: This is one way of achieving both Polymorphism and code reuse at the same time.Other forms of polymorphism:There are other way of achieving polymorphism, such as interfaces, which provide only polymorphism but no code reuse (sometimes the code is quite different, such as Move for a Snake would be quite different from Move for a Dog, in which case an Interface would be the better polymorphic choice in this case.In other dynamic languages polymorphism can be achieved with Duck Typing, which is the classes don\'t even need to share the same base class or interface, they just need a method with the same name.Or even more dynamic like Javascript, you don\'t even need classes at all, just an object with the same method name can be used polymorphically.',
    'code': null
};

var p3 = {
    'type': 'question',
    'text': 'I found out that the above piece of code is perfectly legal in Java. I have the following questions. ThanksAdded one more question regarding Abstract method classes.',
    'code': 'public class TestClass{public static void main(String[] args) {TestClass t = new TestClass();}private static void testMethod(){abstract class TestMethod{int a;int b;int c;abstract void implementMe();}class DummyClass extends TestMethod{void implementMe(){}}DummyClass dummy = new DummyClass();}}'
};

var p4 = {
    'type': 'question',
    'text': 'In java it\'s a bit difficult to implement a deep object copy function. What steps you take to ensure the original object and the cloned one share no reference?',
    'code': null
};

var p5 = {
    'type': 'answer',
    'text': 'You can make a deep copy serialization without creating some files. Copy: Restore:',
    'code': 'ByteArrayOutputStream bos = new ByteArrayOutputStream();ObjectOutputStream oos = new ObjectOutputStream(bos);oos.writeObject(object);oos.flush();oos.close();bos.close();byte[] byteData = bos.toByteArray();; ByteArrayInputStream bais = new ByteArrayInputStream(byteData);(Object) object = (Object) new ObjectInputStream(bais).readObject();'
};

var p6 = {
    'type': 'answer',
    'text': 'Java has the ability to create classes at runtime. These classes are known as Synthetic Classes or Dynamic Proxies. See for more information. Other open-source libraries, such as and also allow you to generate synthetic classes, and are more powerful than the libraries provided with the JRE. Synthetic classes are used by AOP (Aspect Oriented Programming) libraries such as Spring AOP and AspectJ, as well as ORM libraries such as Hibernate.',
    'code': null
};

var p7 = {
    'type': 'answer accepted-answer',
    'text': 'A safe way is to serialize the object, then deserialize.This ensures everything is a brand new reference.about how to do this efficiently. Caveats: It\'s possible for classes to override serialization such that new instances are created, e.g. for singletons.Also this of course doesn\'t work if your classes aren\'t Serializable.',
    'code': null
};

var p8 = {
    'type': 'answer',
    'text': 'comment this code',
    'code': '/*if (savedinstancestate == null) {     getsupportfragmentmanager().begintransaction()             .add(r.id.container  new placeholderfragment())             .commit(); }*/'
};

var p9 = {
    'type': 'question',
    'text': 'in a class i can have as many constructors as i want with different argument types. i made all the constructors as private it didn\'t give any error because my implicit default constructor was public but when i declared my implicit default constructor as private then its showing an error while extending the class.  why?       this works fine         this can not be inherited',
    'code': 'public class demo4  {     private string name;     private int age;     private double sal;      private demo4(string name  int age) {         this.name=name;         this.age=age;        }      demo4(string name) {         this.name=name;     }      demo4() {         this(\\"unknown\\"  20);         this.sal=2000;     }      void show(){         system.out.println(\\"name\\"+name);         system.out.println(\\"age: \\"+age);     } }  public class demo4  {     private string name;     private int age;     private double sal;      private demo4(string name  int age) {         this.name=name;         this.age=age;     }      demo4(string name) {         this.name=name;     }      private demo4() {         this(\\"unknown\\"  20);         this.sal=2000;     }      void show() {         system.out.println(\\"name\\"+name);         system.out.println(\\"age: \\"+age);     } }'
};

var posts = [p0, p1, p2, p3, p4, p5, p6, p7, p8, p9];

var filteredPosts = posts.map(function (post) {
    filteredPost = {};
    filteredPost['type'] = post['type'];
    filteredPost['text'] = removeStopWords(post['text']);
    if (post['code']) {
        filteredPost['code'] = removeStopWords(post['code']);
    }

    return filteredPost;
});

var app = angular.module('elkdemo',[]);
var hostname = location.protocol + '//'+ location.host.split(":")[0];
app.factory('elkservice', ['$http', function($http){
    var o = {

    };
    o.init = function(data){
        return $http.post("/init", data).success(function(res){
            console.log("initialzed the app");
        })
    }
    o.postData = function(data){
        return $http.post('/send', data).success(function(res){
            console.log("Data send successfully");
         })
    }
   
    o.getStats = function(){
        
        return $http.get('/getlogmetrics').success(function(res){
          //  console.log(res.pipeline.events);
            return res.pipeline.events;
        });
    }
    
    return o;
}])
var browserFingerPrint = '';
new Fingerprint2().get(function(result, components){
  console.log(result); 
  browserFingerPrint = result;
});

app.controller('postController', ['$scope','elkservice', function($scope, post){
    $scope.log_in =0;
    $scope.log_out = 0;
    $scope.pre_in=0;
    $scope.pre_out=0;
    $scope.pre_time= 0;
    post.init({'browserid':browserFingerPrint}).success(function(data){
         post.getStats().success(function(data){
             console.log(data);
             $scope.pre_in = data.pipeline.events.in;
             $scope.pre_out = data.pipeline.events.out;
             $scope.pre_time = (data.pipeline.events.duration_in_millis/1000).toFixed(6);
         });

        $scope.onMouseMove = function(e){
        var output = {
        browserid : browserFingerPrint,
        position: { x: e.clientX, y: e.clientY }
       }
        //$scope.output += JSON.stringify(output).concat("\n");
        post.postData(output).success(function(data){
            $('.moved').animateCss('pulse');
        });

         
       
     }

      setInterval(function(){
        post.getStats().success(function(data){
            console.log("IN" + data.pipeline.events.in);
            
            var curIn = data.pipeline.events.in;
            var curOut = data.pipeline.events.out;
            var curTime = (data.pipeline.events.duration_in_millis/1000).toFixed(6);
            console.log( "PI :"+ $scope.pre_in +", "+ "PO" + $scope.pre_out +", "+ "PT "+ $scope.pre_time );
            console.log( "CI :"+ curIn +", "+ "CO" + curOut +", "+ "CT "+ curTime );
            if(curTime > $scope.pre_time){
            $scope.log_in = ( (curIn - $scope.pre_in) / (curTime-$scope.pre_time)).toFixed(2);
            $scope.log_out = ((curOut - $scope.pre_out) / (curTime-$scope.pre_time)).toFixed(2);
            } else if(curIn!==$scope.pre_in && curOut!==$scope.pre_out) {
                $scope.log_in = ( (curIn - $scope.pre_in) / 0.001).toFixed(2);
                $scope.log_out = ((curOut - $scope.pre_out) / 0.001).toFixed(2);
            }
            else{
                $scope.log_in = ( (curIn - $scope.pre_in) / 1).toFixed(2);
                $scope.log_out = ((curOut - $scope.pre_out) / 1).toFixed(2);
            }
            $scope.pre_in = curIn;
            $scope.pre_out = curOut;
            $scope.pre_time = curTime
        })    
    
      }, 1000);
    });

    $(document).ready(function(){
    $('iframe').each(function(index, frame){
        console.log(frame);
        var oldsrc = frame.src;
        var newsrc = oldsrc.replace("b2859f114225bf4dc7b366c2e5710f0d",browserFingerPrint);
        frame.src = newsrc;
    })
})

    
}]);

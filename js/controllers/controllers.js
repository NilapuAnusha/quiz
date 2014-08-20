'use strict';

/* Controller */

app
	.controller('quizCtrl',['$scope', '$http','$timeout',
		function($scope, $http, $timeout){
		var _scope = {};
		_scope.init = function(){
			$scope.level_count = 1;
			$scope.counter = 0;
			$scope.score = 0;
			$scope.total_score = 0;
			$scope.result = 0;
			$scope.score_status = "";
			$scope.timer = 0;
			$http.get('/quizzes/quiz.json',{cache: true}).
				success(function(response, status, headers, config) {
					$scope.score_rules = response.data.final_score_rules.rule;
					$scope.quizzes = response.data.questions.level;
					for(var i=0 ; i < 1 ; i++){
						$scope.quiz1 = $scope.quizzes[i]; 
						for(var j=0; j < $scope.quiz1.question.length ; j++){
							$scope.quiz1.question[j].status = 0;
						}
						$scope.quiz = $scope.quiz1.question; 
						$scope.level = $scope.quiz1;	
						//calling random question	
						$scope.randomQuestions($scope.quiz);
						$scope.quiz2 = $scope.quizzes[i+1]; 
						$scope.quiz3 = $scope.quizzes[i+2]; 
					}
				}).error(function(data) {
		      console.log('not entered');
		    });
		}

    $scope.randomQuestions = function(questionslist){
    	//cancelling the prevoius timer
    	$timeout.cancel($scope.t);
    	//selecting unique random question
    	$scope.randomQuestion = questionslist
				[Math.floor(Math.random() * questionslist.
					length)];
			//removing previously selected random question
			var item = $scope.quiz.splice($scope.randomQuestion,1)[0];
			$scope.questions = new Array();
			$scope.questions.push($scope.randomQuestion);
			$scope.counter = $scope.counter + 1;
			//calling countdown for question
			$scope.countDown();
    }

		var interval = function() {
      if( $scope.timer > 0){
      	//question timer
        $scope.timer-= 1;
      	$scope.t = $timeout(interval, 1000);
      } else {
      	//on timeout of question
      	$scope.checkAnswer(0);
      }
    }

    $scope.countDown = function () {
    	$scope.timer = $scope.level._seconds_per_question;
    	// calling time interval
    	$timeout(interval, 1000);		
    }

    $scope.checkAnswer = function(option){
    	//intrupting the timer
    	$timeout.cancel($scope.t);
    	//verifying the answer
			if(option == 1){
				$scope.score = $scope.score + parseInt($scope.level._points_per_question);
			} else{

			}
			//checking no.of questions
			if ($scope.counter < parseInt($scope.level._total_questions) + 1){
				//calling random question	
				$scope.randomQuestions($scope.quiz);
			} else {
				console.log('5 questions are completed');
			}
			
    }

    $scope.nextLevel = function(){
    	// next level quiz
    	$scope.total_score = $scope.total_score + $scope.score;
  		$scope.score = 0;
  		$scope.counter = 0;
  		if($scope.level_count == 1){
  			$scope.level_count = $scope.level_count + 1;
  			$scope.quiz = $scope.quiz2.question;
  			$scope.level = $scope.quiz2;
  			$scope.randomQuestions($scope.quiz);
  		} else if($scope.level_count == 2){
  			$scope.quiz = $scope.quiz3.question;
  			$scope.level = $scope.quiz3;
  			$scope.randomQuestions($scope.quiz);
  			$scope.level_count = $scope.level_count + 1;
  		} else {
  			$scope.level_count = $scope.level_count + 1;
  			$scope.result_text();
  		}

    }

    $scope.result_text = function(){
    	//score result status
    	$scope.result = parseInt(($scope.total_score * 100) / 400);
    	for(var k=0; k < $scope.score_rules.length; k++){
    		if($scope.result >= $scope.score_rules[k]._min_percent){
    			$scope.score_status = $scope.score_rules[k].__text;
    		}

    	}
    }

    _scope.init();
	}]);
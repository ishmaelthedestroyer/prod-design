var app = angular.module('App', [
  'ui.router',
  'ui.bootstrap',
  'noToolbox',
  'ui.calendar'
])

.run([
  '$rootScope',
  '$state',
  '$stateParams',
  function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
  }
])

.config([
  '$stateProvider',
  '$urlRouterProvider',
  '$locationProvider',
  function($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
  }
])

.controller('AppCtrl', [
  '$scope',
  '$rootScope',
  '$modal',
  'noLogger',
  'noUtil',
  'User',
  function($scope, $rootScope, $modal, Logger, Util, User) {
    var editOriginal = null;
    $scope.newTask = [];
    $scope.filter = '';
    $scope.now = new Date();

    setInterval(function() {
      // increase current time by 5 seconds every 5 seconds
      $scope.now.setSeconds($scope.now.getSeconds() + 5);
    }, 5000);

    $scope.project = {
      title: 'My project title',
      administrators: [
      ],
      users: [
        'a84',
        'b92',
        '9la',
        '7uy',
        '5ma',
        'e4t'
      ]
      /*
      participants: {
        'a84': 'administrator',
        'b92': 'administrator',
        '9la': 'participant',
        '7uy': 'participant',
        '5ma': 'participant',
        'e4t': 'participant'
      }
      */
    };

    $scope.projects = [
        {
          id: 'mbla',
          title: 'Some Project',
          created: new Date(),
          archived: false,
          administrators: [
            'a84'
          ],
          users: [
            'a84',
            'b92',
            '9la'
          ]
        },
        {
          id: '9iml',
          title: 'Another Project',
          created: new Date(),
          archived: false,
          administrators: [
            '9la',
            '7uy'
          ],
          users: [
            '9la',
            '7uy'
          ]
        },
        {
          id: 'klkl',
          title: 'Something else that\'s pretty long just for testing purposes',
          created: new Date(),
          archived: false,
          administrators: [
            'b92'
          ],
          users: [
            'e4t',
            'b92'
          ]
        },
    ];

    $scope.objectives = [
        {
          id: '123',
          title: 'The first objective',
          created: new Date(),
          archived: false
        },
        {
          id: '456',
          title: 'This is another objective',
          created: new Date(),
          archived: true
        },
        {
          id: '789',
          title: 'The last objective goes here.',
          created: new Date(),
          archived: false
        }
    ];

    var tasks = $scope.tasks = [
      {
        id: Util.random(10),
        title: 'This is a task.',
        objective: '123',
        deadline: new Date(),
        priority: 3,
        attachments: 0,
        completed: false,
        created: new Date(),
        start: new Date(),
        end: new Date(),
        assigned: [
        ],
        archived: false
      },
      {
        id: Util.random(10),
        title: 'And another task with a really, really, really, and I mean really long name.',
        objective: '123',
        deadline: new Date(),
        priority: 3,
        attachments: 0,
        completed: true,
        created: new Date(),
        start: new Date(),
        end: new Date(),
        assigned: [
          'e4t',
          'b92'
        ],
        archived: true
      },
      {
        id: Util.random(10),
        objective: '789',
        title: 'The final task.',
        deadline: new Date(),
        priority: 2,
        attachments: 0,
        completed: true,
        created: new Date(),
        start: new Date(),
        end: new Date(),
        assigned: [
          'e4t'
        ],
        archived: false
      },
      {
        id: Util.random(10),
        title: 'This belongs to the second objective list',
        objective: '456',
        deadline: new Date(),
        priority: 3,
        attachments: 2,
        completed: false,
        created: new Date(),
        start: new Date(),
        end: new Date(),
        assigned: [
          '5ma',
          '7uy'
        ],
        archived: false
      },
      {
        id: Util.random(10),
        objective: '456',
        title: 'This also belongs tot he second objective list.',
        deadline: new Date(),
        priority: 1,
        attachments: 1,
        completed: false,
        created: new Date(),
        start: new Date(),
        end: new Date(),
        assigned: [
          'a84',
          'b92',
          '9la',
          '7uy',
          '5ma',
          'e4t'
        ],
        archived: true
      }
    ];

    // FUNCTIONS

    $scope.editItem = function(item) {
      editOriginal = angular.copy(item); // set fallback incase of cancel
      $scope.editFocus = item;
    };

    $scope.saveEdit = function(item) {
      console.log('Saving edit.');
      $scope.editFocus = null;

      item.title = item.title.trim();

      if (!item.title) {
        // remove item
        for (var i = 0; i < $scope.tasks.length; i++) {
          if ($scope.tasks[i] == item) {
            $scope.tasks.splice(i, 1);
            break;
          }
        }
      }
    };

    $scope.cancelEdit = function(item) {
      console.log('Canceling edit.', {
        original: editOriginal,
        item: item
      });

      var cancelled = false;
      for (var i = 0; i < $scope.tasks.length; i++) {
        if ($scope.tasks[i] == item) {
          cancelled = true;

          // loop through and replace values instead of replacing object
          for (k in editOriginal) {
            $scope.tasks[i][k] = editOriginal[k];
          }
          // $scope.tasks[i] = editOriginal;
          break
        }
      }

      if (!cancelled) {
        for (var i = 0; i < $scope.objectives.length; i++) {
          if ($scope.objectives[i] == item) {
          cancelled = true;
          for (k in editOriginal) {
            $scope.objectives[i][k] = editOriginal[k];
          }
          break
          }
        }
      };

      item = editOriginal;
      $scope.editFocus = null;
    };

    $scope.createNewTask = function(objective, task, index) {
      console.log('Creating new task.', {
        objective: objective,
        newTask: task,
        index: index
      });

      for (var i = 0; i < $scope.objectives.length; i++) {
        if ($scope.objectives[i] == objective) {
          $scope.tasks.push({
            id: Util.random(10),
            created: new Date(),
            title: task,
            objective: objective.id,
            deadline: new Date(),
            priority: 3,
            attachments: 0,
            completed: false,
            archived: false
          });
          break;
        }
      }

      if ($scope.newTask && $scope.newTask[index]) {
        $scope.newTask[index] = '';
      }
    };

    $scope.setFilter = function($e, filter) {
      $e.preventDefault();
      $e.stopPropagation();

      $scope.filter = filter;
    };

    $scope.getFilter = function() {
      if ($scope.filter == '') {
        return {};
      } else if ($scope.filter == 'complete') {
        return { completed: true };
      } else { // filter == 'active'
        return { completed: false };
      }
    };

    $scope.deleteItem = function(item, type) {
      $modal.open({
        backdrop: true,
        keyboard: false,
        backdropClick: false,
        templateUrl: 'delete-modal.html',
        windowClass: 'modal',
        controller: [ '$scope', '$modalInstance', function($s, $m) {
          $s.item = item;
          var body;

          if (!item.archived) {
            body = 'You can either delete this item or save it into the archive.'
          } else {
            body = 'You can either delete this item or restore it from the archive.'
          }

          $s.modal = {
            header: 'Are you sure?',
            body: body
          };

          $s.close = function() {
            $m.dismiss('cancel');
          };

          $s.confirmDelete = function() {
            if (type == 'task') {
              // find and delete task
              for (var i = 0; i < $scope.tasks.length; i++) {
                if ($scope.tasks[i] == item) {
                  $scope.tasks.splice(i, 1);
                  break;
                }
              }
            } else {
              // find and delete tasks belonging to objective
              for (var i = 0; i < $scope.tasks.length; i++) {
                if ($scope.tasks[i].objective == item.id) {
                  $scope.tasks.splice(i, 1);
                }
              }

              for (var i = 0; i < $scope.objectives.length; i++) {
                if ($scope.objectives[i] == item) {
                  $scope.objectives.splice(i, 1);
                  break;
                }
              }
            }

            if ($scope.focus == item) {
              $scope.focus = null;
            }

            $m.dismiss('cancel');
          };

          $s.confirmArchive = function() {
            if (type == 'task') {
              for (var i = 0; i < $scope.tasks.length; i++) {
                if ($scope.tasks[i] == item) {
                  $scope.tasks[i].archived = true;
                  break;
                }
              }
            } else {
              for (var i = 0; i < $scope.objectives.length; i++) {
                if ($scope.objectives[i] == item) {
                  $scope.objectives[i].archived = true;
                  break;
                }
              }
            }

            $m.dismiss('cancel');
          };

          $s.unArchive = function() {
            if (type == 'task') {
              for (var i = 0; i < $scope.tasks.length; i++) {
                if ($scope.tasks[i] == item) {
                  $scope.tasks[i].archived = false;
                  break;
                }
              }
            } else {
              for (var i = 0; i < $scope.objectives.length; i++) {
                if ($scope.objectives[i] == item) {
                  $scope.objectives[i].archived = false;
                  break;
                }
              }
            }

            $m.dismiss('cancel');
          };
        }]
      })
    };

    $scope.newObjective = function() {
      $modal.open({
        backdrop: true,
        keyboard: false,
        backdropClick: false,
        templateUrl: 'objective-modal.html',
        windowClass: 'modal',
        controller: [ '$scope', '$modalInstance', function($s, $m) {
          $s.objective = {};

          $s.modal = {
            header: 'New Objective'
          };

          $s.close = function() {
            $m.dismiss('cancel');
          };

          $s.confirmCreate = function() {
            Logger.debug('Creating objective.', $s.objective);

            if ($s.objective.title && $s.objective.title.length) {
              $scope.objectives.push({
                id: Util.random(10),
                title: $s.objective.title,
                created: new Date(),
                archived: false
              });
            }

            $m.dismiss('cancel');
          };
        }]
      })
    };

    $scope.newProject = function() {
      $modal.open({
        backdrop: true,
        keyboard: false,
        backdropClick: false,
        templateUrl: 'objective-modal.html',
        windowClass: 'modal',
        controller: [ '$scope', '$modalInstance', function($s, $m) {
          $s.objective = {};

          $s.modal = {
            header: 'New Project'
          };

          $s.close = function() {
            $m.dismiss('cancel');
          };

          $s.confirmCreate = function() {
            Logger.debug('Creating project.', $s.objective);

            if ($s.objective.title && $s.objective.title.length) {
              $scope.projects.push({
                id: Util.random(10),
                title: $s.objective.title,
                created: new Date(),
                archived: false
              });
            }

            $m.dismiss('cancel');
          };
        }]
      })
    };

    // # # # # # # # # # # # # # # # # # # # # //
    // # # # # # # # # # # # # # # # # # # # # //
    // # # # # # # # # # # # # # # # # # # # # //
    // # # # # # # # # # # # # # # # # # # # # //

    $scope.focus = null;
    $scope.newTag = null;

    $scope.setFocus = function(item, ref) {
      $scope.focus = ref ? item : angular.copy(item);
      //$scope.focus = angular.copy(item);
    };

    $scope.addTag = function() {
      if ($scope.newTag.length) {
        if (!$scope.focus.tags) {
          $scope.focus.tags = [];
        }

        // don't add duplicates
        for (var i = 0; i < $scope.focus.tags.length; i++) {
          if ($scope.focus.tags[i] == $scope.newTag) {
            return;
          }
        }

        $scope.focus.tags.unshift($scope.newTag);
        $scope.newTag = '';
      }
    }

    $scope.removeTag = function(tag) {
      for (var i = 0; i < $scope.focus.tags.length; i++) {
        if ($scope.focus.tags[i] == tag) {
          return $scope.focus.tags.splice(i, 1);
        }
      }
    };

    $scope.changePriority = function(val) {
      $scope.focus.priority += val;
    };

    /* # # # # # # # # # # */


    /* # # # # # # # # # # */

    $scope.name = '';
    $scope.description = '';

    $scope.date = new Date();
    $scope.date.setTime($scope.date.getTime() + (1000 * 60 * 60 * 24));

    $scope.time = new Date();
    $scope.time.setHours(0)
    $scope.time.setMinutes(0);

    $scope.minDate = new Date();
    $scope.minDate.setMinutes($scope.minDate.getMinutes() +
      60 * 60 * 1000 * 24 * 10);

    $scope.open = function($e) {
      $e.preventDefault();
      $e.stopPropagation();

      $scope.opened = !$scope.opened;
    }

    /*
    */
    $scope.dateOptions = {
      'year-format': "'yy'",
      'starting-day': 1
    };

    $scope.updateDeadline = function() {
      Logger.debug('Updating deadline.', $scope.focus.deadline);

      //$scope.deadline = $scope.date;

    };

    $scope.updateSchedule = function() {
      // make sure scheduled end > scheduled start
      Logger.debug('Updating schedule.', {
        start: $scope.focus.scheduledStart ? $scope.focus.scheduledStart.getTime() : null,
        end: $scope.focus.scheduledEnd ? $scope.focus.scheduledEnd.getTime() : null
      });

      var scheduledStart = $scope.focus.scheduledStart ? $scope.focus.scheduledStart.getTime() : null;
      var scheduledEnd = $scope.focus.scheduledEnd ? $scope.focus.scheduledEnd.getTime() : null;

      if (scheduledStart && scheduledEnd && scheduledStart > scheduledEnd) {
        $scope.focus.scheduledEnd = new Date($scope.focus.scheduledStart.getTime());
      }
    };

    // # # # # # # # # # # # # # # # # # # # # //
    // # # # # # # # # # # # # # # # # # # # # //

    // remove user from task
    $scope.removeUser = function(id) {
      for (var i = 0; i < $scope.focus.assigned.length; i++) {
        if ($scope.focus.assigned[i] == id) {
          $scope.focus.assigned.splice(i, 1);
        }
      }
    }

    // add user to task
    $scope.assignUser = function(item, id) {
      if (!item.assigned) item.assigned = [];

      item.assigned.push(id);
    }

    // # # # # # # # # # # # # # # # # # # # # //
    // # # # # # # # # # # # # # # # # # # # # //

    $scope.mapUser = function(id) {
      return User.mapUser(id);
    }

    $scope.mapUserList = function(ids) {
      return User.mapUserList(ids);
    }

    // # # # # # # # # # # # # # # # # # # # # //
    // # # # # # # # # # # # # # # # # # # # # //

    $scope.changePrivileges = function(project, id, makeAdmin) {
      var isAdmin = false;
      var index;

      for (var i = 0; i < project.administrators.length; i++) {
        if (project.administrators[i] == id) {
          isAdmin = true;
          if (!makeAdmin) {
            project.administrators.splice(i, 1);
          }
        }
      }

      if (makeAdmin && !isAdmin) project.administrators.push(id);
    };

    // # # # # # # # # # # # # # # # # # # # # //
    // # # # # # # # # # # # # # # # # # # # # //

    $scope.events = [
      [
        {
          title: 'This is an event.',
          start: new Date(),
          end: new Date(new Date().getTime() + (1000 * 60 * 60)),
          /*
          start: new Date(),
          end: new Date(),
          */
          allDay: false
        }
      ],
      $scope.tasks
    ];

    $scope.calendarEventClick = function(event, allDay, jsEvent, view) {
      Logger.debug('Calender event was clicked.', {
        event: event,
        allDay: allDay,
        jsEvent: jsEvent,
        view: view
      });

      Util.safeApply($scope, function() {
        $scope.focus = event;
      });
      //$scope.focus = angular.copy(event);

      $scope.toggleSidebar(true);
    }

    $scope.calendarOnResize = function(event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view ) {
      Logger.debug('Calendar resized.', {
        event: event,
        dayDelta: dayDelta,
        minuteDelta: minuteDelta,
        revertFunc: revertFunc,
        jsEvent: jsEvent,
        ui: ui,
        view: view
      })
    };

    $scope.calenderEventDrop = function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view) {
      Logger.debug('Calendar event dropped.', {
        event: event,
        dayDelta: dayDelta,
        minuteDelta: minuteDelta,
        revertFunc: revertFunc,
        jsEvent: jsEvent,
        ui: ui,
        view: view
      });

      // stupid hack to force rerendering of focus model on sidebar
      if ($scope.focus && $scope.focus.id == event.id) {
        $scope.focus = {}
        $scope.$digest();

        setTimeout(function() {
          Util.safeApply($scope, function() {
              $scope.focus = event;
          });
        }, 500);
      }
    };

    $scope.calendarEventResize = function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view) {
      Logger.debug('Calendar event resized.', {
        event: event,
        dayDelta: dayDelta,
        minuteDelta: minuteDelta,
        revertFunc: revertFunc,
        jsEvent: jsEvent,
        ui: ui,
        view: view
      });

      // stupid hack to force rerendering of focus model on sidebar
      if ($scope.focus && $scope.focus.id == event.id) {
        $scope.focus = {}
        $scope.$digest();

        setTimeout(function() {
          Util.safeApply($scope, function() {
              $scope.focus = event;
          });
        }, 500);
      }
    };

    $scope.uiConfig = {
      calendar:{
        height: 900,
        editable: true,
        header:{
          left: 'month agendaWeek agendaDay',
          center: 'title',
          right: 'today prev,next'
        },
        eventClick: $scope.calendarEventClick,
        eventDrop: $scope.calenderEventDrop,
        eventResize: $scope.calendarEventResize
      }
    }

    $scope.createEvent = function() {
      var e = {
        id: Util.random(10),
        title: '',
        start: new Date(),
        allDay: true,
        className: 'new-event'
      };

      $scope.events[0].unshift(e);
      setTimeout(function() {
        $scope.setFocus(e, true);
      }, 100);
    };

    // # # # # # # # # # # # # # # # # # # # # //
    // # # # # # # # # # # # # # # # # # # # # //

    $scope.toggleSidebar = function(open) {
      if (open) {
        $('.content-left').removeClass('col-xs-12');
        $('.content-left').addClass('col-xs-6');

        $('.content-right').removeClass('col-xs-0');
        $('.content-right').addClass('col-xs-6');
      } else if (typeof open != 'undefined' && !open) {
        $('.content-left').removeClass('col-xs-6');
        $('.content-left').addClass('col-xs-12');

        $('.content-right').removeClass('col-xs-6');
        $('.content-right').addClass('col-xs-0');
      } else {
        $('.content-left').toggleClass('col-xs-6 col-xs-12');
        $('.content-right').toggleClass('col-xs-6 col-xs-0');
      }

      // trigger resize events
      setTimeout(function() {
        $(window).trigger('resize');
        window.dispatchEvent(new Event('resize'));
      }, 200);
    }

    // # # # # # # # # # # # # # # # # # # # # //
    // # # # # # # # # # # # # # # # # # # # # //

    $scope.updateTask = function() {
      if ($scope.focus) {
        for (var i  = 0; i < $scope.tasks.length; i++) {
          if ($scope.tasks[i].id == $scope.focus.id) {
            var keys = Object.keys($scope.focus);
            for (var k in $scope.focus) {
              $scope.tasks[i][k] = $scope.focus[k];
            }
          }
        }
      }
    };

  }
])

.service('User', [
  function() {
    var users = [
        {
          id: 'a84',
          username: 'Ishmael',
          avatar: '/assets/img/default-avatar.jpg'
        },
        {
          id: 'b92',
          username: 'Andrew',
          avatar: '/assets/img/default-avatar.jpg'
        },
        {
          id: '9la',
          username: 'Joey',
          avatar: '/assets/img/default-avatar.jpg'
        },
        {
          id: '7uy',
          username: 'Jonathan',
          avatar: '/assets/img/default-avatar.jpg'
        },
        {
          id: '5ma',
          username: 'Sabastian',
          avatar: '/assets/img/default-avatar.jpg'
        },
        {
          id: 'e4t',
          username: 'Karen',
          avatar: '/assets/img/default-avatar.jpg'
        }
    ];

    return {
      getObject: function() {
        return {

        }
      },
      mapUser: function(id) {
        if (user[id]) {
          return user[id];
        } else {
          return {};
        }
      },
      mapUserList: function(ids) {
        if (!ids || !ids.length) {
          return [];
        }

        var queue = [];

        for (var i = 0; i < ids.length; i++) {
          for (var i2 = 0; i2 < users.length; i2++) {
            if (users[i2].id == ids[i]) {
              queue.push(users[i2]);
              break;
            }
          }
        }

        return queue;
      }
    };
  }
])

.directive('noEscape', function() {
  'use strict';

  var ESCAPE_KEY = 27;

  return function(scope, elem, attrs) {
    elem.bind('keydown', function(e) {
      if (e.keyCode === ESCAPE_KEY) {
        scope.$apply(attrs.noEscape)
      }
    })
  };
})

.directive('noFocus', function($timeout) {
  'use struct';

  return function(scope, elem, attrs) {
    scope.$watch(attrs.noFocus, function(newVal) {
      if (newVal) {
        $timeout(function () {
          elem[0].focus();
        }, 0, false);
      }
    });
  };
})

.filter('mapUserList', [
  'User',
  function(User) {
    return function(ids) {
      return User.mapUserList(ids);
    };
  }
])

.filter('dedup', function() {
  return function(array, ref, overlap) {
    if (!array) return [];
    if (!ref) return array;

    var queue = [];
    var duplicate;

    for (var i = 0; i < array.length; i++) {
      duplicate = false;
      for (var i2 = 0; i2 < ref.length; i2++) {
        if (array[i] == ref[i2]) {
          duplicate = true;
          // if overlapping item and looking for overlaps
          if (overlap) {
            queue.push(array[i]);
            break;
          }
        }
      }

      // if no overlap and not looking for overlaps
      if (!duplicate && !overlap) {
        queue.push(array[i]);
      }
    }

    return queue;
  }
})

.filter('mergeArray', function() {
  return function() {
    if (!arguments.length) return []
    if (arguments.length == 1) return arguments[0]

    var queue = [];
    for (var i = 0; i < arguments.length; i++) {
      if (arguments[i] && arguments[i].length) {
        for (var i2 = 0; i2 < arguments[i].length; i2++) {
          queue.push(arguments[i][i2]);
        }
      }
    }
    return queue;
  };
})

.filter('inArray', function() {
  return function(item, ref) {
    if (!item) return false;
    if (!ref || !ref.length) return false;

    for (var i = 0; i < ref.length; i++) {
      if (ref[i] == item) return true;
    }

    return false;
  }
})

.filter('mapKeys', function() {
  return function(obj) {
    return Object.keys(obj);
  }
})

.directive('toggleSidebar', function() {
  return function(scope, elem, attrs) {
    elem.bind('click', function(e) {
      if (attrs.toggleSidebar == 'open') {
        $('.content-left').removeClass('col-xs-12');
        $('.content-left').addClass('col-xs-6');

        $('.content-right').removeClass('col-xs-0');
        $('.content-right').addClass('col-xs-6');
      } else if (attrs.toggleSidebar == 'closed') {
        $('.content-left').removeClass('col-xs-6');
        $('.content-left').addClass('col-xs-12');

        $('.content-right').removeClass('col-xs-6');
        $('.content-right').addClass('col-xs-0');
      } else {
        $('.content-left').toggleClass('col-xs-6 col-xs-12');
        $('.content-right').toggleClass('col-xs-6 col-xs-0');
      }

      // trigger resize events
      setTimeout(function() {
        $(window).trigger('resize');
        window.dispatchEvent(new Event('resize'));
      }, 200);
    });
  };
});

angular.element(document).ready(function() {
  angular.bootstrap(document, ['App']);
});
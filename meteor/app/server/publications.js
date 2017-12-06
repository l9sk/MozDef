var buildSortParams = function(sortField, sortDirection) {
    var sortParams = [];
    
    var direction = sortDirection || 'desc';
  
    var field = sortField || 'timestamp_sort';
    if (sortField === 'ts') {
      sortParams.push(['timestamp_sort', direction]);
      sortParams.push(['severity_sort', direction])
    } else if (sortField === 'sev') {
      sortParams.push(['severity_sort', direction]);
      sortParams.push(['category_sort', direction]);
    } else if (sortField === 'cat') {
      sortParams.push(['category_sort', sortDirection]);
      sortParams.push(['severity_sort', direction]);
    } 
  
    return sortParams;
  }

FindFromPublication.publish('alertssummary', function(skipCount, sortField, sortDirection) {
  // parameter validations
  check(skipCount, CustomChecks.positiveIntegerCheck);
  check(sortField, CustomChecks.sortFieldCheck);
  check(sortDirection, CustomChecks.sortDirectionCheck)

  Counts.publish(this, 'alertCount', Customers.find(), { 
    noReady: true
  });

  return alerts.find({}, {
    limit: 10,
    skip: skipCount,
    sort: AlertSortSettings.getSortParams(sortField, sortDirection)
  });
});

Meteor.publish("alerts-summary", function(skipCount) {
    var positiveIntegerCheck = Match.Where(function(x) {
        check(x, Match.Integer);
        return x >= 0;
    });
    check(skipCount, positiveIntegerCheck);

    Counts.publish(this, 'alertCount', alerts.find(), {
        noReady: true
    });
});

//Meteor.publish("alerts-summary", function (searchregex,timeperiod,recordlimit) {
//    //tail the last 100 records by default
//    
//    //default parameters
//    timeperiod = typeof timeperiod !== 'undefined' ? timeperiod: 'tail';
//    searchregex = typeof searchregex !== 'undefined' ? searchregex: '';
//    recordlimit = ['number'].indexOf(typeof(recordlimit)) ? 100:recordlimit;
//    //sanity check the record limit
//    if ( recordlimit >10000 || recordlimit < 1){
//        recordlimit = 100;
//    }
//    
//    if ( timeperiod ==='tail' || timeperiod == 'none' ){
//        return alerts.find(
//            {summary: {$regex:searchregex}},
//            {fields:{
//                    _id:1,
//                    esmetadata:1,
//                    utctimestamp:1,
//                    utcepoch:1,
//                    summary:1,
//                    severity:1,
//                    category:1,
//                    acknowledged:1,
//                    acknowledgedby:1,
//                    url:1
//                    },
//               sort: {utcepoch: -1},
//               limit:recordlimit}
//        );
//    } else {
//        //determine the utcepoch range
//        beginningtime=moment().utc();
//        //expect timeperiod like '1 days'
//        timevalue=Number(timeperiod.split(" ")[0]);
//        timeunits=timeperiod.split(" ")[1];
//        beginningtime.subtract(timevalue,timeunits);
//        return alerts.find(
//            {summary: {$regex:searchregex},
//            utcepoch: {$gte: beginningtime.unix()}},
//            {fields:{
//                    _id:1,
//                    esmetadata:1,
//                    utctimestamp:1,
//                    utcepoch:1,
//                    summary:1,
//                    severity:1,
//                    category:1,
//                    acknowledged:1
//                    },
//               sort: {utcepoch: -1},
//               limit:recordlimit}
//        );            
//    }
//});
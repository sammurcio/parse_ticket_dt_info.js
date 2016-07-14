"use strict";

var tx = execution.getRadarTicket().getIpimTicket().getTransactions().toArray();
var ticketContents="";
var dtRegex = /(CI:\s[\w\s\W]*?)\sEnd\sof\sList/i;
var dtRegex = /(CI:\s[\w\s\W]*?)\nEnd\sof\sList/i;
var ciRegex = /CI:\s([\w\W]*?)\sStart\sDate:/i;
var startDateRegex = /Start\sDate:\s([\w\W]*?)\sStart\sTime/i;
var startTimeRegex = /Start\sTime\s\(UTC\):\s([\w\W]*?)\sEnd\sDate:/i;
var endDateRegex = /End\sDate:\s([\w\W]*?)\sEnd\sTime/i;
var endTimeRegex = /End\sTime\s\(UTC\):\s([\w\W]*?)$/i;
var csv = "Host Name,Time Zone,Start Date,Start Time,End Date,End Time\n";


//find post with user data
for (var x = 0; x < tx.length; x++) {
  var tx_type = tx[x].getType();
  var tx_atta = tx[x].getAttachments().toArray();

  for (var y = 0; y<tx_atta.length; y++) {
    if (tx_type = "Correspondence" && /CI:\s/i.test(tx_atta[y].getContent())) {
	  ticketContents += tx_atta[y].getContent()+"\n";
	}
  }
}

//extract specified downtime data
if (ticketContents) {
  var dtData = dtRegex.exec(ticketContents);
  dtData = dtData[1]; 

  //convert data to CSV format
  var dataArray = dtData.split("\n");
  for( var i = 0; i < dataArray.length; ++i ) {
    var tempCI = ciRegex.exec(dataArray[i]);
    tempCI = tempCI[1];
  	
    var tempStartDate = startDateRegex.exec(dataArray[i]);
    tempStartDate = tempStartDate[1];

    var tempStartTime = startTimeRegex.exec(dataArray[i]);
    tempStartTime = tempStartTime[1];

    var tempEndDate = endDateRegex.exec(dataArray[i]);
    tempEndDate = tempEndDate[1];

    var tempEndTime = endTimeRegex.exec(dataArray[i]);
    tempEndTime = tempEndTime[1];

    var tempEntry = tempCI + ",UTC," + tempStartDate + "," + tempStartTime + "," + tempEndDate + "," + tempEndDate + "\n";

    csv += tempEntry;
    }
  }  else {
  }

csv;
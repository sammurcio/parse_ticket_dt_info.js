"use strict";

var tx = execution.getRadarTicket().getIpimTicket().getTransactions().toArray();
var ticketContents= ""; 
//var ticketContents="Hello,\n\nPlease apply downtime as requested:\n\nCI: chi-asm-ext1.mizuho Start Date: 07/21/2016 Start Time (UTC): 13:00 End\nDate: 07/21/2016 End Time (UTC): 15:00\nCI: chi-mgmtsw4.mizuho Start Date: 07/21/2016 Start Time (UTC): 13:00 End\nDate: 07/21/2016 End Time (UTC): 15:00\nCI: chi-mgmasdftsw4.mizuho Start Date: 07/21/2016 Start Time (UTC): 13:00 End\nDate: 07/21/2016 End Time (UTC): 15:00\nEnd of List\n\nThank You,\n\n\nSam Murcio\n";
var dtRegex = /(CI:\s[\w\s\W]*?)\sEnd\sof\sList/i;
var ciRegex = /CI:\s([\w\W]*?)\sStart\sDate:/i;
var startDateRegex = /Start\s?Date:\s?([\d\/]*?)\s?Start\s?Time/i;
var startTimeRegex = /Start\s?Time\s?\(UTC\):\s?([\d\W]*?)\s?End\s?Date:/i;
var endDateRegex = /End\s?Date:\s?([\d\/]*?)\s?End\s?Time/i;
var endTimeRegex = /End\s?Time\s?\(UTC\):\s?([\d\W]*?)$/i;
var csv = "Host Name, Olson Time Zone (Informational Only), Time Zone, Start Date, Start Time, End Date, End Time\n";

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
  dtData = dtData.replace(/\n/g, "");
  dtData = dtData.replace(/([\d])(CI:)/g, "$1\n$2");

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

    var tempEntry = tempCI + ",UTC,UTC," +tempStartDate + "," + tempStartTime + "," + tempEndDate  + "," + tempEndTime + "\n";

    csv += tempEntry;
    }
  }  else {
    csv = "No downtime data found.\n";
  }

console.log(csv);
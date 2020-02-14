function updateChechCodeView() {
  if (!$('#TicketForm_ticketPrice_01')) {
    return
  }

  $('#TicketForm_ticketPrice_01').val(1)
  $('#TicketForm_ticketPrice_01').trigger('change')

  $('#TicketForm_agree').click()
  const html = $("html").html();
  const findString = `$(this).attr("name", "TicketForm[agree]`
  const index = html.indexOf(findString)
  const findEndString = `");`
  const endIndex = html.indexOf(findEndString, index)

  const newName = "TicketForm[agree]" + html.substring(index + findString.length, endIndex)
  $('#TicketForm_agree').attr("name", newName);
  $('#TicketForm_verifyCode').focus();
}

function updateOrderView() {
  let hasTTPOrder = false
  $('.order_item').each((index, item) => {
    if (hasTTPOrder) {
      return
    }
    hasTTPOrder = $(item).text().indexOf("看見夕陽了嗎？") > -1
  })

  if (!hasTTPOrder){
    // 沒有TTP的訂單一率不做事
    return
  }
  // 取得左右訂單資料，並修改購買節目名稱
  let allOrder = []
  $('.order_item').each((index, item) => {
    const orderInfo = {}
    $(item).find(".ticket_detail").find(".repo_bg").children().each((index2, item2) => {
      if (index2 === 0){
        //第一個欄位
        const text = $(item2).text().trim()        
        const findIndex =  text.indexOf("【第")
        const endIndex =  text.indexOf("部】")
        if(findIndex === -1 || endIndex === -1){
          if (orderInfo.hasOwnProperty("round")){
            delete orderInfo.round
          }
          return
        } 
        orderInfo["round"] = text.substring(findIndex + "【第".length , endIndex )        
      }else if (index2 === 1){
        //第一個欄位
        const text = $(item2).text().trim()        
        const findIndex =  text.indexOf("倉庫 / ")
        if(findIndex === -1 ){
          if (orderInfo.hasOwnProperty("name")){
            delete orderInfo.name
          }
          if (orderInfo.hasOwnProperty("number")){
            delete orderInfo.number
          }
          return
        } 
        const name = text.substring(findIndex + "倉庫 / ".length ).trim()
        orderInfo["name"] = name.split("-")[0]
        orderInfo["number"] = name.split("-")[1]
      }
    })

    if (!(orderInfo.hasOwnProperty("round") && orderInfo.hasOwnProperty("name") )){
      return
    }
    $(item).find(".order_list").find(".col_2").each((index3, item3) => {
        if (index3 === 0){
          // 訂單編號
          orderInfo["orderNo"] = $(item3).text().trim()
        }else if (index3 === 1){
          orderInfo["orderTime"] = $(item3).text().trim()
        }

    })
    const insertHtml = "<p>第" + orderInfo.round + "部" + "\t" + orderInfo.name + "-" + orderInfo.number + "<p>"
    $(item).find(".order_list").find(".col_5").append( insertHtml )
  
    allOrder.push(orderInfo)
  })
  
  // 塞入統計報表與按鈕，並製作出表格

  const table1Array = allOrder.reduce((sum, obj, nowIndex, array) => {
   
    const findIndex =  sum.findIndex(obj2 => {
      return obj2.name == obj.name && obj2.number == obj.number
    })
    if (findIndex >　-1){
      let nowSum = sum[findIndex]["sum"]
      sum[findIndex]["sum"] = nowSum + 1 
    }else{
      const newObj = Object.assign(obj)
      newObj["sum"] = 1
      sum.push(newObj)
    }
    return sum
  }, []).sort( (a, b) => {
    return a.name > b.name ? 1 : -1
  })
  
  const sum = table1Array.reduce((sum , obj) => sum + obj.sum, 0)

  let table1 = `
  <table  class="table table-striped table-hover" style="width:100%;">
  <tr>
    <th>成員名稱</th>
    <th>部數</th> 
    <th>數量</th>
  </tr>`
  
  table1Array.forEach(element => {
    table1 += `
    <tr>
    <td>${element.name}</td>
    <td>第${element.round}部</td>
    <td>${element.sum}</td>
  </tr>
    `
  });
  table1 +=`</table>`
  
  const table2Array = table1Array.sort((a, b) => {
    return parseInt(a.round) > parseInt(b.round) ? 1 : -1
  })

  let table2 = `
  <table  class="table table-striped table-hover" style="width:100%; margin-top: 12px;">
  <tr>
    <th>部數</th>
    <th>成員名稱</th> 
    <th>數量</th>
  </tr>
  `
  table2Array.forEach(element => {
    table2 += `
    <tr>
    <td>`
    table2 += `第${element.round}部 `
    if (element.round == "1"){
      table2 += '11:00~12:00  (11:40排隊截止)'
    }else if (element.round == "2"){
      table2 += '12:30~13:30  (13:10排隊截止)'
    }else if (element.round == "3"){
      table2 += '14:00~15:00  (14:40排隊截止)'
    }else if (element.round == "4"){
      table2 += '15:30~16:30  (16:10排隊截止)'
    }else if (element.round == "5"){
      table2 += '17:00~18:00  (17:40排隊截止)'
    }else if (element.round == "6"){
      table2 += '18:30~19:30  (19:10排隊截止)'
    }else if (element.round == "7"){
      table2 += '12:00~13:00  (12:40排隊截止)'
    }else if (element.round == "8"){
      table2 += '13:30~14:30  (14:10排隊截止)'
    }else if (element.round == "9"){
      table2 += '15:00~16:00  (15:40排隊截止)'
    }else if (element.round == "10"){
      table2 += '16:30~17:30  (17:10排隊截止)'
    }
    
    table2 += `</td>
    <td>${element.name}</td>
    <td>${element.sum}</td>
  </tr>
    `
  });
  table2 +=`</table>`

  const table3Array = table1Array.reduce((sum, obj) => {
    const findIndex =  sum.findIndex(obj2 => obj2.name == obj.name)
    if (findIndex >　-1){
      sum[findIndex]["sum"] += obj["sum"]
    }else{
      const newObj = Object.assign({}, obj)
      sum.push(newObj)
    }
    return sum
  }, []) .sort( (a, b) => {
    return a.name > b.name ? 1 : -1
  })

  let table3 = `
  <table  class="table table-striped table-hover" style="width:100%;">
  <tr>
    <th>成員名稱</th>
    <th>數量</th>
    <th>佔比</th>
  </tr>`
  
  table3Array.forEach(element => {
    table3 += `
    <tr>
    <td>${element.name}</td>
    <td>${element.sum}</td>
    <td>${(parseFloat(element.sum)/ parseFloat(sum) * 100.0).toLocaleString('en',{maximumFractionDigits: 2} )} %</td>
  </tr>
    `
  });
  table3 +=`</table>`

  const table4Array = table1Array.reduce((sum, obj) => {
    const findIndex =  sum.findIndex(obj2 => obj2.round == obj.round)
    if (findIndex >　-1){
      sum[findIndex]["sum"] += obj["sum"]
    }else{
      const newObj = Object.assign({}, obj)
      sum.push(newObj)
    }
    return sum
  }, []) .sort( (a, b) => {
    return parseInt(a.round)  > parseInt(b.round) ? 1 : -1
  })

  let table4 = `
  <table  class="table table-striped table-hover" style="width:100%;">
  <tr>
    <th>部數</th>
    <th>數量</th>
  </tr>`
  
  table4Array.forEach(element => {
    table4 += `
    <tr>
    <td>`
    table4 += `第${element.round}部 `

    if (element.round == "1"){
      table4 += '11:00~12:00  (11:40排隊截止)'
    }else if (element.round == "2"){
      table4 += '12:30~13:30  (13:10排隊截止)'
    }else if (element.round == "3"){
      table4 += '14:00~15:00  (14:40排隊截止)'
    }else if (element.round == "4"){
      table4 += '15:30~16:30  (16:10排隊截止)'
    }else if (element.round == "5"){
      table4 += '17:00~18:00  (17:40排隊截止)'
    }else if (element.round == "6"){
      table4 += '18:30~19:30  (19:10排隊截止)'
    }else if (element.round == "7"){
      table4 += '12:00~13:00  (12:40排隊截止)'
    }else if (element.round == "8"){
      table4 += '13:30~14:30  (14:10排隊截止)'
    }else if (element.round == "9"){
      table4 += '15:00~16:00  (15:40排隊截止)'
    }else if (element.round == "10"){
      table4 += '16:30~17:30  (17:10排隊截止)'
    }
    
    table4 +=  `</td>
    <td>${element.sum}</td>
  </tr>
    `
  });
  table4 +=`</table>`

  let insertHtml = `
  <div class="row mg-top">
    <div class="">
      <button id="showOrderButton">顯示 Team TP 握手會 報表</button>
      <small style="margin-left: 12px;">共${sum}張</small>
    </div>
    <div class="order_item">
      <div id="ttpTable" style="display:none; margin-top: 12px;">
        <div style="width: 100%; height: 42px;">
          <button class="btn btn-success" id="downloadExcelButton" style="float:right;">下載excel報表</button>
        </div>
        <div id="tab-panel">
          <div class="tabs">
            <a><span>總計</span></a>
            <a><span>依照姓名</span></a>
            <a><span>依照部數</span></a>
            <a><span>部數統計數量</span></a>

          </div>
          <ul class="tab-content">
            <li><div><small>共${table3Array.length}位</small></div>${table3}</li>
            <li>
            ${table1}
            </li>
            <li>${table2}</li>
            <li>${table4}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>`
  $('#content').prepend(insertHtml)

  $("#showOrderButton").click(function(){
    if($("#ttpTable").is(':visible') ){
      $("#ttpTable").hide()
    }else{
      $("#ttpTable").show()
    }
  })
  $("#downloadExcelButton").click(function(){
      var wb = XLSX.utils.book_new();

      /* 總計 */ 
      var data = [
        ["成員名稱", "數量", "佔比"],
      ]
      data = data.concat(table3Array.map(item => {
        return [item.name, item.sum, (parseFloat(item.sum)/ parseFloat(sum) * 100.0).toLocaleString('en',{maximumFractionDigits: 2} ) + "%"]
      }))
      /* make the worksheet */
      var ws = XLSX.utils.aoa_to_sheet(data);
      /* add to workbook */
      XLSX.utils.book_append_sheet(wb, ws, "總計");

      /* 依照姓名 */
      data = [
        ["成員名稱", "部數", "數量"],
      ]
      data = data.concat(table1Array.map(item => {
        return [item.name, `第${item.round}部`, item.sum]
      }))
      /* make the worksheet */
      var ws2 = XLSX.utils.aoa_to_sheet(data);
      /* add to workbook */
      XLSX.utils.book_append_sheet(wb, ws2, "依照姓名");

      /* 依照部數 */
      data = [
        ["部數", "成員名稱", "數量"],
      ]
      data = data.concat(table2Array.map(item => {
        return [`第${item.round}部 `, item.name, item.sum]
      }))
      /* make the worksheet */
      var ws3 = XLSX.utils.aoa_to_sheet(data);
      /* add to workbook */
      XLSX.utils.book_append_sheet(wb, ws3, "依照部數");

      /* 部數統計 */
      data = [
        ["部數", "數量"],
      ]
      data = data.concat(table4Array.map(item => {
        return [`第${item.round}部 `, item.sum]
      }))
      /* make the worksheet */
      var ws4 = XLSX.utils.aoa_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws4, "部數統計");

      /* 所有訂單資訊 */
      data = [
        ["訂單編號", "填寫時間", "部數", "成員名稱" ],
      ]
      data = data.concat(allOrder.map(item => {
        return [item.orderNo, item.orderTime,`第${item.round}部 `, item.name + "-" + item.number ]
      }))
      /* make the worksheet */
      var ws5 = XLSX.utils.aoa_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws5, "所有訂單資料");

      /* generate an XLSX file */
      XLSX.writeFile(wb,  "TTP 3rd 握手會報表_" + moment().format("YYYYMMDDHHmm") + ".xlsx");
  })
  
}

function updateInputButtonToAButton(){
  $(".gamelist").find(".row").append(`<div class="col-xs-12" style="margin-top: 12px; color:red;"><p style="float:right; ">立即訂購 按鈕可以按ctrl+右鍵 or 滑鼠中鍵開啟新分頁 </p></div>`)


  $("#gameList").find("input.btn-next").each((index, item)=>{
    const inputButton = $(item)
    const url = inputButton.data("href")
    const name = inputButton.attr("name")

    let aButton = `<a class="btn btn-next" href="${url}" name="${name}">立即訂購</a>`
    inputButton.replaceWith(aButton)       
  })
}

function updateMasterView() {


  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
  var myObserver = new MutationObserver(function(mutationRecords) {
    mutationRecords.forEach ( function (mutation) {
      updateInputButtonToAButton()

      if($("#gameListContainer").find(".row").children().length === 2){
        // 加入提示可以按ctrl+右鍵 or 滑鼠中鍵開啟新分頁 
        $("#gameListContainer").find(".row").append(`<div class="col-xs-12" style="margin-top: 12px; color:red;"><p style="float:right; ">立即訂購 按鈕可以按ctrl+右鍵 or 滑鼠中鍵開啟新分頁 </p></div>`)
      }

    } );
  });
  $('#gameListContainer').each(function(){
    myObserver.observe (this , { childList: true, characterData: false, attributes: false, subtree: false });
  });
  
}
function isASCII(str) {
  return /^[\x00-\x7F]*$/.test(str);
}
function updateEnterCodeView(){
  


  $("#checkCode").focus()
  $("#checkCode").keyup(function(){
    
    let nowText = $(this).val()
    if (!isASCII(nowText)){
      const newText = nowText.replace(/[^\x20-\x7E]/g, '')
      $(this).val(newText)

    }
    nowText = $(this).val()
    if (nowText !== nowText.toUpperCase()) {

      let newtext = nowText.toUpperCase()
      newtext = newtext.replace(/[^\x20-\x7E]/g, '')
      $(this).val(newtext)
    }

  })
}

function main() {
  const url = window.location.href
  
  if (url.indexOf("20_TTP3rd") === -1) {
    // 是19_TTPFes才有用，其他網頁判斷是否為訂單紀錄無效

    if (url.indexOf("/order") > -1) {
      // 修改order畫面
      updateOrderView()
      return
    }

    return
  }
  // 更改驗證碼的頁面動作
  updateChechCodeView()

  if (url.indexOf("/activity/detail/20_TTP3rd") > -1){
    //主頁，將input改成 a連結
    updateMasterView()
  }
  if (url.indexOf("/activity/game/20_TTP3rd") > -1){
    //場次列表頁，將input改成 a連結
    updateInputButtonToAButton()
  }
  if (url.indexOf("/ticket/verify/20_TTP3rd/") > -1){
    //輸入握手券頁面，強制將input轉大寫
    updateEnterCodeView()
  }
}

main()


$(function(){
  var $tabPanel = $('#tab-panel') ,
      $tabs = $tabPanel.find('.tabs') ,
      $tab = $tabs.find('a') ,
      $tabContent = $tabPanel.find('.tab-content') ,
      $content = $tabContent.find('> li');
   
  $tab.eq(0).addClass('active');
  $content.eq(0).show();
   
  $tab.on('click',function(){
      var $tabIndex = $(this).index();
      $(this).addClass('active').siblings().removeClass('active');
      $content.eq($tabIndex).show().siblings().hide();
  });
});


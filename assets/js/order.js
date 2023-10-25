"use strict";
var baseUrlOrder = "http://localhost:8888/api/v1/order";

function SearchOrderRequest(orderBy, statusOrder, pageSize, pageNumber, sortBy, sortType) {
    this.orderBy = orderBy;
    this.statusOrder = statusOrder;
    this.pageSize = pageSize;
    this.pageNumber = pageNumber;
    this.sortBy = sortBy;
    this.sortType = sortType;
}

$(function () {
    // $("#pagination").load("/assets/html/pagination.html");
    console.log(123);
    orderPageAll();
});

function orderPageAll() {
    changActivePage('order-all')
    $(".status-order").empty()
    $(".status-order").append("<div>Trạng thái: Tất cả</div>")
    getListOrder(null)
}

function orderPagePending() {
    changActivePage('order-pending');
    getListOrder('PENDING');
    $(".status-order").load("/assets/html/button-order.html");
}

function orderPageDone() {
    changActivePage('order-done')
    getListOrder('DONE');
}

function orderPageCancel() {
    changActivePage('order-cancel')
    getListOrder('CANCEL');
}

function changActivePage(pageActive) {
    const navLinks = Array.from(document.getElementsByClassName("nav-link"));
    navLinks.forEach(element => element.classList.remove('active', 'base-shoppe-bg'))

    var navActive = document.getElementById(pageActive);
    navActive.classList.add('active', 'base-shoppe-bg');
    navActive.classList.remove('text-dark')
}

function getListOrder(status) {
    let userId = localStorage.getItem("id");
    let request = new SearchOrderRequest(userId, status, 100, 1, "orderDate", "DESC")
    let params = "&accountId="  + userId;
    if(status){{
        params = params + "&orderStatus=" + status;
    }}
    //   ------------------------------------- API DANH SÁCH ORDER -------------------------------------
    $.ajax({
        url: baseUrlOrder + "/get-by-status" + param,
        type: "POSGETT",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem("token"));
        },
        contentType: "application/json",
        // data: JSON.stringify(request),
        error: function (err) {
            console.log(err)
            confirm(err.responseJSON.message)
        },
        success: function (data) {
            fillOrderToTable(data, status);
        }
    });

    // // ------Fake data bằng file json------
    // fetch('/assets/data/order.json')
    //     .then((response) => response.json())
    //     .then((json) => {
    //         if (status) {
    //             let data = json.content.filter(function (element) {
    //                 return element.status === status;
    //             });
    //             fillOrderToTable(data, status);
    //         } else {
    //             fillOrderToTable(json.content, status);
    //         }
    //     });
}

function fillOrderToTable(orderList, status) {
    $("#order-item").empty()
    console.log(orderList, status)
    for (var index = 0; index < orderList.length; index++) {
        let order = orderList[index];
        let totalAmount = order.quantity * order.product.price;
        let statusOrder;
        if (order.orderStatus === 'PENDING') {
            statusOrder = "Chờ thanh toán";
        } else if (order.orderStatus === 'DONE') {
            statusOrder = "Đã thanh toán";
        } else {
            statusOrder = "Đã huỷ";
        }

        let textStatus = (order.orderStatus === 'PENDING' && status === 'PENDING') ?
            `<div class="row">
                        <div class="col-6">
                            <button type="button" class="btn base-font base-shoppe-bg" style=" width: 80%;" 
                            onclick="paymentOder(`+ order.id + `)">Mua hàng</button>
                        </div>

                        <div class="col-6">
                            <button type="button" class="btn base-font text-white bg-secondary " style=" width: 80%;" 
                            onclick="cancelOrder(`+ order.id + `)">Huỷ đơn hàng</button>
                        </div>
                    </div>` : ('Trạng thái: ' + statusOrder);

        $("#order-item").append(
            `<div class="row border-bottom mb-3 bg-white">
            <div class="col-3 center-block text-center">
                <img src="`+ order.product.image + `" 
                class="img-fluid img-thumbnail img-order " alt="Sheep">
            </div>
            <div class="col-5 d-flex justify-conten-start align-items-center">
                <div class="">
                    <h4 class="p-2"><b>`+ order.product.productName + `</b></h4>
                    <div class="p-2">Số lượng: `+ order.quantity + `</div>
                    <div class="p-2">Giá sản phẩm: `+ order.product.price + ` đ</div>
                    <div class="p-2">Ngày order: `+ order.createDate + `</div>
                </div>
            </div>
            <div class="col-4 d-flex justify-conten-start align-items-center">
                <div class="">
                    <h4 class="color-shoppe p-2"><b>Thành tiền: `+ totalAmount + ` đ</b></h4>
                    <div class="p-2 status-order">`
            + textStatus +
            `</div>
                </div>
            </div>
        </div>`
        )
    }
}



function paymentOder(orderId) {
    //   ------------------------------------- API THANH TOÁN ORDER -------------------------------------
    // $.ajax({
    //     url: baseUrlOrder + "/buy-product/" + orderId,
    //     type: "POST",
    //     beforeSend: function (xhr) {
    //         xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem("token"));
    //     },
    //     contentType: "application/json",
    //     error: function (err) {
    //         console.log(err)
    //         confirm(err.responseJSON.message)
    //     },
    //     success: function (data) {
    //         orderPagePending();
    //         alert("Đã thanh toán thành công!" + orderId);
    //     }
    // });
    orderPagePending();
    alert("Đã thanh toán thành công!" + orderId);

}

function cancelOrder(orderId) {
    //   ------------------------------------- API HUỶ ĐƠN HÀNG -------------------------------------
    // $.ajax({
    //     url: baseUrlOrder + "/cancel-product/" + orderId,
    //     type: "POST",
    //     beforeSend: function (xhr) {
    //         xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem("token"));
    //     },
    //     contentType: "application/json",
    //     error: function (err) {
    //         console.log(err)
    //         confirm(err.responseJSON.message)
    //     },
    //     success: function (data) {
    //         orderPagePending();
    //         alert("Đã huỷ đơn hàng thành công!" + orderId)
    //     }
    // });

    orderPagePending();
    alert("Đã huỷ đơn hàng thành công!" + orderId)
}
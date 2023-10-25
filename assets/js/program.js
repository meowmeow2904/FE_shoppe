"use strict";
$(function () {
    // if (!isLogin()) {
    //     location.href = "login.html"
    // } else {
    //     $(".header").load("header.html");
    //     $(".main").load("home.html");
    //     $(".footer").load("footer.html");
    //     $("#success-alert").hide();
    // }
    $("#header").load("/assets/html/header.html");
    $(".category").load("/assets/html/filter.html");
    $(".footer").load("/assets/html/footer.html");
    $("#sort").load("/assets/html/sort.html");
    $(".home-product").load("/assets/html/product.html");
    // $("#pagination").load("/assets/html/pagination.html");
});

function navToOrder(){
    $("#body-shoppe").load("/assets/html/order.html");
}

function showAlrtSuccess() {
    $("#success-alert").fadeTo(2000, 500).slideUp(500, function () {
        $("#success-alert").slideUp(3000);
    });
}




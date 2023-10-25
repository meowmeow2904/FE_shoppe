"use strict";

let productName = "";
let typeProduct = [];
let shippingUnit = [];
let statusProduct = [];
let minPrice = 0;
let maxPrice = 9999999999999;
let isManagerProduct = true;
let token = "";
let pageSize = 6;
let pageNumber = 1;
let sortBy = "id";
let sortType = "desc";

let baseUrlProduct = "http://localhost:8888/api/v1/product";

$(function () {
  buildManager();
  getListProduct();
});

function buildManager() {
  if ("USER" == localStorage.getItem("role") || localStorage.getItem("role") === null) {
    isManagerProduct = false;
  } else {
    isManagerProduct = true;
    // $("#button-add").empty();
    $("#button-add").empty().append(`<button type="button" class="btn base-font base-shoppe-bg" style=" width: 80%;" 
                              onclick="addProduct()">Thêm mới</button>`)
  }
}

function SearchProductRequest(productName, productType, shippingUnit, productStatus,
  minPrice, maxPrice, pageSize, pageNumber, sortBy, sortType) {
  this.productName = productName;
  this.productTypes = productType;
  this.shippingUnits = shippingUnit;
  this.productStatus = productStatus;
  this.minPrice = minPrice;
  this.maxPrice = maxPrice;
  this.size = pageSize;
  this.page = pageNumber;
  this.sortBy = sortBy;
  this.sortType = sortType;
}

function CreatProductRequest(id, name, image, price, status, shippingUnit, type) {
  this.id = id;
  this.name = name;
  this.image = image;
  this.price = price;
  this.productStatus = status;
  this.shippingUnit = shippingUnit;
  this.productType = type;
}

function fillterApply() {
  getTypeProduct();
  getShippingUnit();
  getStatusProduct();
  getFillterPrice();

  getListProduct();
}

async function getListProduct() {
  let request = new SearchProductRequest(productName, typeProduct, shippingUnit, statusProduct,
    minPrice, maxPrice, pageSize, pageNumber, sortBy, sortType)
    // ------------------------------------- API TÌM KIẾM PRODUCT -------------------------------------
  $.ajax({
    url: baseUrlProduct + "/search",
    type: "POST",
    // beforeSend: function (xhr) {
    //   xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem("token"));
    // },
    contentType: "application/json",
    data: JSON.stringify(request),
    error: function (err) {
      console.log(err)
      confirm(err.responseJSON.message)
    },
    success: function (data) {
      fillProductsToTable(data.content);
      buildPagination(data.number + 1, data.totalPages);
    }
  });

  // ------Fake data bằng file json------
//   fetch('/assets/data/product.json')
//     .then((response) => response.json())
//     .then((json) => {
//       console.log(json);
//       fillProductsToTable(json.content);
//       buildPagination(json.number + 1, json.totalPages);
//     });
// }

function searchName(){
  productName = document.getElementById("productNameSearch").value;
  fillterApply();
}

function buildPagination(number, totalPages) {
  // kiểm tra nếu trang hiện tại là trang đầu -> disable đi
  if (number === 1) {
    $("#pagination").empty().append(`<li class="pagination-item">
                              <a class="pagination-item__link">
                                <i class="pagination-item__icon fas fa-angle-left"></i>
                              </a></li>`);
  } else {
    $("#pagination").empty().append(`<li class="pagination-item">
                              <a href="#" class="pagination-item__link " onclick="prePage()">
                                <i class="pagination-item__icon fas fa-angle-left"></i>
                              </a></li>`);
  }

  // Dùng hàm for để build ra số trang. Kiểm tra xem trang hiện tại là bao nhiêu thì background vàng
  for (let index = 1; index <= totalPages; index++) {
    if (number === (index)) {
      $('#pagination').append(`<li class="pagination-item pagination-item--active">
                                <a href="" class="pagination-item__link" onclick="chosePage(`+ index + `)">` + index + `</a>
                              </li>`);
    } else {
      $('#pagination').append(`<li class="pagination-item">
                                <a href="" class="pagination-item__link" onclick="chosePage(`+ index + `)">` + index + `</a>
                              </li>`);
    }
  }

  // Kiểm tra nếu trang hiện tại là trang cuối -> disable đi
  if (number === totalPages) {
    $("#pagination").append(`<li class="pagination-item">
                              <a class="pagination-item__link "">
                                <i class="pagination-item__icon fas fa-angle-right"></i>
                              </a></li>`);
  } else {
    $("#pagination").append(`<li class="pagination-item">
                              <a href="#" class="pagination-item__link " onclick="nextPage()">
                                <i class="pagination-item__icon fas fa-angle-right"></i>
                              </a></li>`);
  }


}

function chosePage(page) {
  event.preventDefault()
  pageNumber = page;
  getListProduct();
}
function prePage() {
  event.preventDefault()
  pageNumber--;
  getListProduct();
}

function nextPage() {
  event.preventDefault()
  pageNumber++;
  getListProduct();
}
function fillProductsToTable(productList) {
  $("#content-product").empty()
  console.log(productList)
  for (var index = 0; index < productList.length; index++) {
    let product = productList[index];
    let statusProduct = product.productStatus === "NEW" ? 'Mới' : 'Đã sử dụng';

    $(".content-product").append(`<div class="col-4">
    <div href="#" class="home-product-item">
      <div class="home-product-item__img"
        style="background-image: url(`+ product.image + `);">
      </div>
      <h4 class="home-product-item__name">
        <b>`+ product.productName + `</b>
      </h4>
      <div class="home-product-item__price">
        <span class="home-product-item__price-current">Giá: `+ product.price + ` đ</span>
      </div>
      <div class="home-product-item__price">
        <span class="home-product-item__price-current">Tình trạng: `+ statusProduct + `</span>
      </div>
      <div class="home-product-item__price">
        <span class="home-product-item__price-current">Đơn vị vận chuyển: `+ product.shippingUnit + `</span>
      </div>
      <div class="home-product-item__price">
        <span class="home-product-item__price-current">Danh mục: `+ product.productType + `</span>
      </div>
      <div class="input-group mb-3 input-group-lg w-100">
      
      ${isManagerProduct ?
        `<div class="d-flex justify-content-around w-100">
        <div>
        <a data-target="#modalProduct" onclick="editProduct('${product.id}', '${product.image}', '${product.productName}', 
        '${product.price}', '${product.shippingUnit}', '${product.productStatus}', '${product.productType}')">
          <button type="button" class="btn base-font base-shoppe-bg" >
          Chỉnh sửa</button></a>
        </div>
        <div>
          <button type="button" class="btn base-font bg-danger text-white" onclick="confirmDeleteProduct(${product.id})">Xoá sản phẩm</button>
        </div>
      </div>`
        :
        `<input type="number" class="form-control" id="input-product-${index}" value="0">
        <div class="input-group-prepend">
          <button type="button" class="btn base-font base-shoppe-bg" onclick="addToBasket('input-product-${index}', ${product.id})">Áp dụng</button>
        </div>`
      }

      </div>
      <div class="home-product-item__action">
        <span class="home-product-item__like home-product-item__like--liked">
          <i class="home-product-item__like-icon-empty far fa-heart"></i>
          <i class="home-product-item__like-icon-fill fas fa-heart"></i>
        </span>
        <div class="home-product-item__rating">
          <i class="home-product-item__star--gold fas fa-star"></i>
          <i class="home-product-item__star--gold fas fa-star"></i>
          <i class="home-product-item__star--gold fas fa-star"></i>
          <i class="home-product-item__star--gold fas fa-star"></i>
          <i class="fas fa-star"></i>
        </div>
        <div class="home-product-item__sold">88 Đã bán</div>
      </div>
      <div class="home-product-item__favourite">
        <i class="fas fa-check "></i>
        <span>Yêu thích</span>
      </div>
      <div class="home-product-item__sale-off">
        <span class="home-product-item__sale-off-percent">43%</span>
        <span class="home-product-item__sale-off-label">GIẢM</span>
      </div>
    </div>
  </div>`)
  }
}

function getTypeProduct() {
  typeProduct = [];
  var checkedPhone = document.getElementById("phone").checked;
  if (checkedPhone) {
    typeProduct.push("PHONE")
  }
  var checkedComputer = document.getElementById("computer").checked;
  if (checkedComputer) {
    typeProduct.push("COMPUTER")
  }
  var checkedClothes = document.getElementById("clothes").checked;
  if (checkedClothes) {
    typeProduct.push("CLOTHES")
  }
  var checkedFootwear = document.getElementById("footwear").checked;
  if (checkedFootwear) {
    typeProduct.push("FOOTWEAR")
  }
}

function getShippingUnit() {
  shippingUnit = [];
  var checkedExpress = document.getElementById("express").checked;
  if (checkedExpress) {
    shippingUnit.push("EXPRESS")
  }
  var checkedFast = document.getElementById("fast").checked;
  if (checkedFast) {
    shippingUnit.push("FAST")
  }
  var checkedSave = document.getElementById("save").checked;
  if (checkedSave) {
    shippingUnit.push("SAVE")
  }
}

function getStatusProduct() {
  statusProduct = [];
  var statusNew = document.getElementById("statusNew").checked;
  if (statusNew) {
    statusProduct.push("NEW")
  }
  var statusOld = document.getElementById("statusOld").checked;
  if (statusOld) {
    statusProduct.push("OLD")
  }
}

function getFillterPrice() {
  minPrice = document.getElementById("minPrice").value;
  maxPrice = document.getElementById("maxPrice").value;
}

function clearFillter() {
  document.getElementById("phone").checked = false;
  document.getElementById("computer").checked = false;
  document.getElementById("clothes").checked = false;
  document.getElementById("footwear").checked = false;

  document.getElementById("express").checked = false;
  document.getElementById("fast").checked = false;
  document.getElementById("save").checked = false;

  document.getElementById("statusNew").checked = false;
  document.getElementById("statusOld").checked = false;

  document.getElementById("minPrice").value = "";
  document.getElementById("maxPrice").value = "";
}

function CreatOrderRequest(accountId, productId, quantity) {
  this.accountId = accountId;
  this.productId = productId;
  this.quantity = quantity;
}

function addToBasket(input, productId) {
  console.log(input, document.getElementById(input).value)
  let quantity = document.getElementById(input).value;
  if (quantity > 0) {
    let text = "Bạn có chắc mua sản phẩm?.";
    if (confirm(text) == true) {
      console.log("ĐÃ thêm", quantity, productId)

      // Khởi tạo các gía trị cho request
      let accountId = localStorage.getItem("id");
      let request = new CreatOrderRequest(accountId, productId, quantity);

      //   ------------------------------------- API CHO SẢN PHẨM VÀO GIỎ -------------------------------------
      $.ajax({
        url: "http://localhost:8888/api/v1/order/create",
        type: "POST",
        beforeSend: function (xhr) {
          xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem("token"));
        },
        contentType: "application/json",
        data: JSON.stringify(request),
        error: function (err) {
          console.log(err)
          confirm(err.responseJSON.message)
        },
        success: function (data) {
          showAlrtSuccess();
          getListProduct();
        }
      });
      // showAlrtSuccess();
    }
  } else {
    alert("Số lượng sản phẩm phải lớn hơn 1")
  }
}

function navManagerProduct() {
  isManagerProduct = true;
  buildProduct();
}

function editProduct(productId, imageProduct, productName, price, shippingUnit, status, type) {
  console.log(productId, imageProduct, productName, price, shippingUnit, status, type)
  document.getElementById("productId").value = productId;
  document.getElementById("productName").value = productName;
  document.getElementById("imageProduct").value = imageProduct;
  document.getElementById("priceProduct").value = price;
  document.getElementById("statusProduct").value = status;
  document.getElementById("shippingUnitProduct").value = shippingUnit;
  document.getElementById("typeProduct").value = type;
  $('#modalProduct').modal('show')
}

function addProduct() {
  resetFormProduct();
  $('#modalProduct').modal('show')
}

function confirmDeleteProduct(productId) {
  $('#modalConfirmDelete').modal('show')
  document.getElementById("productIdDelete").value = productId;
}

function deleteProduct() {
  let productId = document.getElementById("productIdDelete").value;
  //   ------------------------------------- API XOÁ SẢN PHẨM -------------------------------------
  $.ajax({
    url: baseUrlProduct + "/" + productId,
    type: "DELETE",
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem("token"));
    },
    contentType: "application/json",
    error: function (err) {
      console.log(err)
      confirm(err.responseJSON.message)
    },
    success: function (data) {
      showAlrtSuccess()
      getListProduct();
      $('#modalConfirmDelete').modal('hide')
    }
  });

  // showAlrtSuccess();
  // $('#modalConfirmDelete').modal('hide');
}

function saveProduct() {
  // Lấy các thông tin cần thiết trên form
  const productId = document.getElementById('productId').value;
  const productName = document.getElementById('productName').value;
  const imageProduct = document.getElementById('imageProduct').value;
  const priceProduct = document.getElementById('priceProduct').value;
  const statusProduct = document.getElementById('statusProduct').value;
  const shippingUnitProduct = document.getElementById('shippingUnitProduct').value;
  const typeProduct = document.getElementById('typeProduct').value;

  // Tạo 1 request
  let request = new CreatProductRequest(productId, productName, imageProduct, priceProduct, statusProduct,
    shippingUnitProduct, typeProduct);
  let url = (productId === "") ? (baseUrlProduct + "/create") : (baseUrlProduct + "/update/");
  let type = (productId === "") ? "POST" : "PUT";

  //   ------------------------------------- API UPDATE, THÊM MỚI SẢN PHẨM -------------------------------------
  $.ajax({
    url: url,
    type: type,
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem("token"));
    },
    contentType: "application/json",
    data: JSON.stringify(request),
    error: function (err) {
      console.log(err)
      confirm(err.responseJSON.message)
    },
    success: function (data) {
      $('#modalProduct').modal('hide')
      showAlrtSuccess();
      getListProduct();
    }
  });
  // $('#modalProduct').modal('hide')
  // showAlrtSuccess();
}

function resetFormProduct() {
  document.getElementById("productId").value = "";
  document.getElementById("productName").value = "";
  document.getElementById("imageProduct").value = "";
  document.getElementById("priceProduct").value = "";
  document.getElementById("statusProduct").value = "NEW";
  document.getElementById("shippingUnitProduct").value = "EXPRESS";
  document.getElementById("typeProduct").value = "PHONE";
}
}
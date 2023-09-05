function lazyImg() {
  const observer = lozad(".lozad", {
    rootMargin: "500px 0px",
    threshold: 0.1,
    enableAutoReload: true,
  });
  observer.observe();
}

lazyImg();

var swiperRegister;
var gameStep = 0;
var butText = [
  "Nhận mã OTP",
  "Xác nhận",
  "Tiếp theo",
  "GỬI KẾT QUẢ",
  "Cửa hàng fontactiv",
];

var registerData = {
  name: "",
  phone: "",
  email: "",
  agreeTnc: "",
  agreePrivacy: "",
};

var answers = [
  {
    content: "",
    other: "",
  },
  {
    content: "",
    other: "",
  },
  {
    content: "",
    other: "",
  },
  {
    content: "",
    other: "",
  },
  {
    content: "",
    other: "",
  },
  {
    content: "",
    other: "",
  },
  {
    content: "",
    other: "",
  },
  {
    content: "",
    other: "",
  },
  {
    content: "",
    other: "",
  },
];

var timerOtp;
var otpCountValue = 60;
var currentPhone = "";

var phoneMin = 9;
var phoneMax = 12;

var userData = false,
  phoneData,
  emailData,
  chkCtn = false,
  chkPrivacy = false;

function change_alias(alias) {
  var str = alias;
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    " "
  );
  return str;
}

function validEmpty(byThis) {
  var result = true;
  if ($(byThis).val() === "") {
    result = false;
  }
  return result;
}

function validName(byThis) {
  var result = true;
  var rg = /^[a-zA-z]+([\s][a-zA-Z]+)*$/;

  var value = $(byThis).val();
  if (value === "") {
    result = false;
  } else if (value !== "") {
    if (rg.test(change_alias(value))) {
      result = true;
    } else {
      result = false;
    }
  }
  return result;
}

function validPhone(byThis) {
  var regex = /^\d+$/;
  var result = true;
  var value = $(byThis).val();
  if (value === "") {
    result = false;
  } else if (value !== "") {
    if (
      /^\S*$/.test(value) &&
      value.replaceAll(/\s/g, "").match(regex)[0].length <= phoneMax
    ) {
      result = true;
    } else {
      result = false;
    }
  }

  return result;
}

function validEmail(byThis) {
  var email = $(byThis).val();
  if (email === "") {
    return false;
  } else {
    if (!/^\S*$/.test(email)) {
      return false;
    }
  }
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function registerError(byThis) {
  if ($(byThis).attr("id") === "txt_fullname") {
    userData = validName("#txt_fullname");
    if (userData) {
      $(".byUser").removeClass("show__error");
    } else {
      $(".byUser").addClass("show__error");
    }
  }
  if ($(byThis).attr("id") === "txt_phone") {
    phoneData = validPhone("#txt_phone");
    if (phoneData) {
      $(".byPhone").removeClass("show__error");
    } else {
      $(".byPhone").addClass("show__error");
    }
  }
  if ($(byThis).attr("id") === "txt_email") {
    emailData = validEmail("#txt_email");
    if (emailData) {
      $(".byEmail").removeClass("show__error");
    } else {
      $(".byEmail").addClass("show__error");
    }
  }
}

function registerValid() {
  userData = validName("#txt_fullname");
  phoneData = validPhone("#txt_phone");
  emailData = validEmail("#txt_email");

  chkCtn = $("#chkTnc").is(":checked") ? true : false;
  chkPrivacy = $("#chkPrivacy").is(":checked") ? true : false;

  if (userData && phoneData && emailData && chkCtn && chkPrivacy) {
    if ($("#txt_phone").val().trim().length >= phoneMin) {
      $("#registerBut").attr("disabled", false);
    } else {
      $("#registerBut").attr("disabled", true);
    }
  } else {
    $("#registerBut").attr("disabled", true);
  }
}

function ingredientScroll() {
  if ($(".ingredient-scroll").length) {
    $(".ingredient-scroll").niceScroll({
      autohidemode: false,
      horizrailenabled: false,
      touchbehavior: true,
      cursorborder: "0px solid #fff",
      cursorwidth: "6px",
      cursorcolor: "#EDEDED",
      background: "#ffffff",
      cursorborderradius: "5px",
    });
  }
}

function inputHolder() {
  $(".form-group .input-txt")
    .focus(function (e) {
      $(this).closest(".show__error").removeClass("show__error");
    })
    .focusout(function (e) {
      // Info Valid
      if ($(".register-box").length > 0) {
        registerError(this);
        registerValid();
      }
    });
  $(".form-group .input-txt").on("input", function () {
    // Info Valid
    if ($(".register-box").length > 0) {
      registerError(this);
      registerValid();
    }
  });

  // Check Login valid
  $("#chkTnc, #chkPrivacy").change(function () {
    registerValid();
  });
}

$(document).on("click", ".faq-title", function (e) {
  box = $(this).parent();
  next = $(this).next();

  if (box.hasClass("active")) {
    box.removeClass("active");
    next.slideUp();
  } else {
    var active = $(".faq-item.active");
    var previous = active.find(".faq-detail");
    if (previous && previous.length > 0) {
      active.removeClass("active");
      previous.slideUp();
    }
    box.addClass("active");
    next.slideDown();
  }
});

$(document).on("click", ".select__header", function (e) {
  var box = $(this).parent();
  if (box.hasClass("open__select")) {
    box.removeClass("open__select");
  } else {
    $(".select").removeClass("open__select");
    box.addClass("open__select");
  }
});

$(document).on("click", ".select__box li", function (e) {
  var that = $(this);
  var box = $(this).parent().parent().parent();

  box.find("li").removeClass("selected");
  that.addClass("selected");
  box.removeClass("open__select");

  box.find(".select__input").html(that.text());
});

$(document).on("click", ".ingredient-but, .ingredient-close", function (e) {
  $(".ingredient-content").toggleClass("show__table");
});

$(document).on("click touchstart", function (event) {
  if (
    $(".select").has(event.target).length == 0 &&
    !$(".select").is(event.target)
  ) {
    $(".select").removeClass("open__select");
  }
});

function healthSwiper() {
  if ($(".health-swiper").length) {
    new Swiper(".health-swiper", {
      effect: "slide",
      loop: false,
      watchOverflow: true,
      grabCursor: true,
      slidesPerView: 1.1,
      spaceBetween: 20,
      grid: {
        rows: 2,
      },
      breakpoints: {
        300: {
          slidesPerView: 1.1,
          spaceBetween: 20,
          grid: {
            rows: 2,
          },
        },
        1024: {
          slidesPerView: 4,
          spaceBetween: 22,
          grid: {
            rows: 1,
          },
        },
        1440: {
          slidesPerView: 4,
          spaceBetween: 34,
          grid: {
            rows: 1,
          },
        },
      },
      pagination: {
        el: ".health .swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".health .swiper-button-next",
        prevEl: ".health .swiper-button-prev",
      },
    });
  }
}

function expertSwiper() {
  if ($(".expert-swiper").length) {
    new Swiper(".expert-swiper", {
      effect: "slide",
      speed: 800,
      loop: false,
      watchOverflow: true,
      grabCursor: true,
      slidesPerView: 1.1,
      spaceBetween: 20,
      grid: {
        rows: 2,
      },
      breakpoints: {
        300: {
          slidesPerView: 1.1,
          spaceBetween: 20,
          grid: {
            rows: 2,
          },
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 22,
          grid: {
            rows: 1,
          },
        },
        1440: {
          slidesPerView: 3,
          spaceBetween: 34,
          grid: {
            rows: 1,
          },
        },
      },
      pagination: {
        el: ".expert .swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".expert .swiper-button-next",
        prevEl: ".expert .swiper-button-prev",
      },
    });
  }
}

function promotionSwiper() {
  if ($(".promotion-swiper").length) {
    new Swiper(".promotion-swiper", {
      effect: "slide",
      speed: 800,
      loop: false,
      watchOverflow: true,
      grabCursor: true,
      slidesPerView: 1.1,
      spaceBetween: 20,
      grid: {
        rows: 2,
      },
      breakpoints: {
        300: {
          slidesPerView: 1.1,
          spaceBetween: 20,
          grid: {
            rows: 2,
          },
        },
        1024: {
          slidesPerView: 4,
          spaceBetween: 22,
          grid: {
            rows: 1,
          },
        },
        1440: {
          slidesPerView: 4,
          spaceBetween: 34,
          grid: {
            rows: 1,
          },
        },
      },
      pagination: {
        el: ".promotion .swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".promotion .swiper-button-next",
        prevEl: ".promotion .swiper-button-prev",
      },
    });
  }
}

function heroSwiper() {
  if ($(".heroSlider").length) {
    new Swiper(".heroSlider", {
      effect: "slide",
      speed: 800,
      loop: false,
      watchOverflow: true,
      grabCursor: true,
      slidesPerView: 1,
      spaceBetween: 0,
      grid: {
        rows: 1,
      },
      pagination: {
        el: ".hero__box .swiper-pagination",
        clickable: true,
      },
    });
  }
}

function subjectSwiper() {
  if ($(".subject-swiper").length) {
    new Swiper(".subject-swiper", {
      effect: "slide",
      speed: 800,
      loop: false,
      watchOverflow: true,
      grabCursor: true,
      autoplay: {
        delay: 3000,
      },
      grid: {
        rows: 2,
      },
      spaceBetween: 30,
      slidesPerView: 1.4,
      breakpoints: {
        1024: {
          grid: {
            rows: 1,
          },
          slidesPerView: 3.2,
          spaceBetween: 22,
        },
        1440: {
          grid: {
            rows: 1,
          },
          slidesPerView: 3.2,
          spaceBetween: 34,
        },
      },
      pagination: {
        el: ".subject-box .swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".subject-box .swiper-button-next",
        prevEl: ".subject-box .swiper-button-prev",
      },
    });
  }
}

function relationSwiper() {
  if ($(".relationSlider").length) {
    new Swiper(".relationSlider", {
      effect: "slide",
      speed: 800,
      loop: false,
      watchOverflow: true,
      grabCursor: true,
      autoplay: {
        delay: 3000,
      },
      grid: {
        rows: 1,
      },
      spaceBetween: 30,
      slidesPerView: 1.2,
      breakpoints: {
        1024: {
          slidesPerView: 1,
          spaceBetween: 0,
          grid: {
            rows: 1,
          },
        },
      },
      pagination: {
        el: ".relation__box .swiper-pagination",
        clickable: true,
      },
    });
  }
}

function countOtp() {
  $(".resendOtp").removeClass("isRetry");
  timerOtp = setInterval(function () {
    var minSecond = otpCountValue < 10 ? "0" + otpCountValue : otpCountValue;
    document.querySelector(".time__count").innerHTML = minSecond;
    otpCountValue--;
    if (otpCountValue < 0) {
      clearInterval(timerOtp);
      $(".resendOtp").addClass("isRetry");
    }
  }, 1000);
}

function numberInput(byThis) {
  $(byThis).val(
    $(byThis)
      .val()
      .replace(/[^0-9]/g, "")
  );
}

function otpValid() {
  var result = true;
  if (
    $("#otp1").val() === "" ||
    $("#otp2").val() === "" ||
    $("#otp3").val() === "" ||
    $("#otp4").val() === ""
  ) {
    result = false;
  }
  return result;
}

function registerSwiper() {
  if ($(".register-swiper").length) {
    swiperRegister = new Swiper(".register-swiper", {
      effect: "slide",
      speed: 1000,
      loop: false,
      watchOverflow: true,
      allowTouchMove: false,
      grabCursor: true,
      slidesPerView: 1,
      spaceBetween: 20,
      initialSlide: gameStep,
    });
  }
}

function checkOtp() {
  if (otpValid()) {
    $(".otp__message, .otp__list").removeClass("invalid");
    $(".otp__message, .otp__list").addClass("valid");
    $("#registerBut").attr("disabled", false);
  } else {
    $("#registerBut").attr("disabled", true);
    $(".otp__list, .otp__message").removeClass("valid");
    $(".otp__message, .otp__list").addClass("invalid");
  }
}

// OTP Checking
$(document).on("input", ".otp__list input", function () {
  numberInput(this);

  if ($(this).val().length == this.maxLength) {
    $(this).next("input").focus();
  }

  checkOtp();
});

$(document).on("input", ".radio-input", function () {
  var ans = $(this).attr("data-ans");
  answers[gameStep - 2].content = ans;
  if (gameStep === 3) {
    var id = $(this).attr("id");
    if (id === "chk_khac") {
      answers[gameStep - 2].other = $("#txt__problem").html();
    } else {
      answers[gameStep - 2].other = "";
    }
  }
  $("#registerBut").attr("disabled", false);
});

function checkAreaInput(id, value) {
  $(id).html(value.replace(/\s+/g, " ").trim().length);
  answers[gameStep - 2].content = value;
  if (value.length > 0 && value.length <= 300) {
    $("#registerBut").attr("disabled", false);
  } else {
    $("#registerBut").attr("disabled", true);
  }
}

$(".area__input").on("input", function () {
  var id = $(this).attr("id");
  var value = document.querySelector(`#${id}`).textContent;
  if (id === "txt__problem") {
    answers[gameStep - 2].content = value;
  } else if (id === "txt_usuallyProblem") {
    checkAreaInput(".usually__limited--length", value);
  } else if (id === "txt_milkKind") {
    checkAreaInput(".millKind__limited--length", value);
  }
});

$(".area__input")
  .focus(function (e) {
    var id = $(this).attr("id");
    var value = document.querySelector(`#${id}`).textContent;
    if (id === "txt__problem") {
      answers[gameStep - 2].content = value;
    } else if (id === "txt_usuallyProblem") {
      checkAreaInput(".usually__limited--length", value);
    } else if (id === "txt_milkKind") {
      checkAreaInput(".millKind__limited--length", value);
    }
  })
  .focusout(function (e) {
    var id = $(this).attr("id");
    var value = document.querySelector(`#${id}`).textContent;
    if (id === "txt__problem") {
      answers[gameStep - 2].content = value;
    } else if (id === "txt_usuallyProblem") {
      checkAreaInput(".usually__limited--length", value);
    } else if (id === "txt_milkKind") {
      checkAreaInput(".millKind__limited--length", value);
    }
  });

function detectNumber(byThis) {
  if (Number($(byThis).val()) > 0) {
    $("#registerBut").attr("disabled", false);
    answers[gameStep - 2].content = Number($(byThis).val());
  } else {
    $("#registerBut").attr("disabled", true);
    answers[gameStep - 2].content = "";
  }
}

$(".game-item .input-number")
  .focus(function (e) {
    detectNumber(this);
  })
  .focusout(function (e) {
    detectNumber(this);
  });
$(".game-item .input-number").on("input", function () {
  detectNumber(this);
});

function validStep() {
  if (gameStep === 0) {
    $(".mangage__game").removeClass("show__back");
    registerValid();
    $(".text__change").html(butText[0]);
    $(".text__change").removeClass("hide__img");
  } else if (gameStep === 1) {
    if (otpValid()) {
      $("#registerBut").attr("disabled", false);
    } else {
      $("#registerBut").attr("disabled", true);
    }
    $(".mangage__game").addClass("show__back");
    $(".text__change").html(butText[1]);
    $(".text__change").removeClass("hide__img");
  } else if (gameStep === 10) {
    $("#registerBut").attr("disabled", false);
    $(".mangage__game").removeClass("show__back");
    $(".text__change").html(butText[4]);
    $(".text__change").addClass("hide__img");
  } else {
    if (answers[gameStep - 2].content !== "") {
      $("#registerBut").attr("disabled", false);
    } else {
      $("#registerBut").attr("disabled", true);
    }
    $(".mangage__game").addClass("show__back");
    if (gameStep === 9) {
      $(".text__change").html(butText[3]);
    } else {
      $(".text__change").html(butText[2]);
    }
    $(".text__change").removeClass("hide__img");
  }
}

$(document).on("click", "#registerBut", function () {
  if (gameStep === 0) {
    // Get user data
    registerData.name = $("#txt_fullname").val();
    registerData.phone = $("#txt_phone").val();
    registerData.email = $("#txt_email").val();
    registerData.agreeTnc = chkCtn;
    registerData.agreePrivacy = chkPrivacy;
    // Reset and Send OTP
    currentPhone = registerData.phone;
    $(".resendOtp").removeClass("isRetry");
    $(".otp__list, .otp__message").removeClass("invalid");
    $(".otp__list, .otp__message").removeClass("alid");
    $(".phone__receive").html(currentPhone);
    clearInterval(timerOtp);
    otpCountValue = 60;
    countOtp();
  }
  gameStep++;
  swiperRegister.slideTo(gameStep, 1000, null);
  validStep();
});

$(document).on("click", ".back-but", function () {
  gameStep--;
  $("#registerBut").attr("disabled", false);
  swiperRegister.slideTo(gameStep, 1000, null);
  validStep();
});

$(document).on("click", ".resendOtp", function () {
  if ($(this).hasClass("isRetry")) {
    clearInterval(timerOtp);
    otpCountValue = 60;
    countOtp();
    $(".otp__message, .otp__list").removeClass("invalid");
    $(".otp__message").addClass("valid");
  }
});

var timer = 100;
let lastMove = Date.now() - timer;

function onScroll() {
  if (Date.now() - lastMove >= timer) {
    var scrollTop = $(window).scrollTop();
    var windowH = $(window).height();
    [].slice.call(document.querySelectorAll(".anim")).forEach(function (elm) {
      var elmH = $(elm).innerHeight();
      var eTop = $(elm).offset().top + elmH;

      if (eTop - scrollTop > 200 && eTop - scrollTop <= windowH + elmH) {
        $(elm).addClass("play");
      } else {
        //$(elm).removeClass("play");
      }
    });

    if ($(".header").length) {
      if (scrollTop > $(".header").height() / 1.5) {
        $(".header").addClass("fixed");
      } else {
        $(".header").removeClass("fixed");
      }
    }

    lastMove = Date.now();
  }
}

function setNavigationActive() {
  var page = $("body").attr("id");
  if (page) {
    $(
      ".nav li[data-active=" +
        page +
        "], .footer-nav li[data-active=" +
        page +
        "]"
    ).addClass("active");
  }
}

$(document).on("click", ".is__video", function () {
  var srcVideo = this.getAttribute("video-link");
  fontactivVideo.src = srcVideo;
  if ($(".fontactiv-video").length) {
    $(".fontactiv-video").addClass("show");
    //fontactivVideo.play();
  }
});

$(document).on("click", ".video--close", function () {
  var srcVideo = this.getAttribute("video-link");
  fontactivVideo.src = srcVideo;
  if ($(".fontactiv-video").length) {
    $(".fontactiv-video").removeClass("show");
    fontactivVideo.src = "";
  }
});

$(".search-input").keyup(function (e) {
  e.preventDefault();
  if (e.keyCode == 13) {
    //console.log("enter");
    window.location.href = "search.html";
  }
});

function openMenu() {
  $(document).on("click", ".nav-but", function () {
    $("body").addClass("open__menu");
  });
}

function closeMenu() {
  $(document).on("click", ".close__menu", function () {
    $("body").removeClass("open__menu");
  });
}

$(window).on("scroll", onScroll);

(function () {
  setNavigationActive();
  healthSwiper();
  expertSwiper();
  promotionSwiper();
  subjectSwiper();
  registerSwiper();
  relationSwiper();
  heroSwiper();
  inputHolder();
  openMenu();
  closeMenu();
  setTimeout(function () {
    onScroll();
  }, 100);
})();

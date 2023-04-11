var map = null;
var icon = L.icon({
  iconUrl: "./images/marker.png",
});

var markers = [];
var locations = null;
var branchList = "";

var locationCitys = [
  {
    cityId: 1,
    cityName: "Hồ Chí Minh",
    cityShortName: "HCM",
    lat: 10.801442,
    lng: 106.7471458,
    branchId: 1,
    name: "Store 1",
    address: "Lorem ipsum dolor sit amet consectetur. Enim a sapien mauris",
    phone: "(+84) 902 572 962",
  },
  {
    cityId: 1,
    cityName: "Hồ Chí Minh",
    cityShortName: "HCM",
    lat: 10.7806193,
    lng: 106.6605148,
    branchId: 2,
    name: "Store 2",
    address: "Lorem ipsum dolor sit amet consectetur. Enim a sapien mauris",
    phone: "(+84) 908 981 469",
  },
  {
    cityId: 1,
    cityName: "Hồ Chí Minh",
    cityShortName: "HCM",
    lat: 10.7899544,
    lng: 106.6397284,
    branchId: 3,
    name: "Store 3",
    address: "Lorem ipsum dolor sit amet consectetur. Enim a sapien mauris",
    phone: "(+84) 902 572 962",
  },
  {
    cityId: 2,
    cityName: "Đồng Nai",
    cityShortName: "Đồng Nai",
    lat: 10.946987,
    lng: 106.8575368,
    branchId: 4,
    name: "Store 4",
    address: "Lorem ipsum dolor sit amet consectetur. Enim a sapien mauris",
    phone: "(+84) 908 981 469",
  },
  {
    cityId: 2,
    cityName: "Đồng Nai",
    cityShortName: "Đồng Nai",
    lat: 10.793489,
    lng: 106.9460342,
    branchId: 5,
    name: "Store 5",
    address: "Lorem ipsum dolor sit amet consectetur. Enim a sapien mauris",
    phone: "(+84) 908 981 469",
  },
];

function centerMap(lat, long) {}

function removeMarsker() {
  for (var i = 0; i < markers.length; i++) {
    var marker = markers[i];
    if (map.hasLayer(marker)) {
      map.removeLayer(marker);
    }
  }
}

function findLocation() {
  $(".branch-item").removeClass("show-by-marker");
  $(".branch-list").removeClass("control-by-marker");

  removeMarsker();

  markers = [];
  branchList = "";

  //Tạo mảng marker
  for (var i = 0; i < locations.length; i++) {
    var cityShortName = locations[i].cityShortName;

    var branchId = locations[i].branchId;
    var branchName = locations[i].name;
    var branchAddress = locations[i].address;
    var branchPhone = locations[i].phone;

    var branchItem = `
				<div class="branch-item" data-branch="${branchId}">
				<span class="location">${cityShortName}</span>
				<h3 class="name">${branchName}</h3>
				<div class="address">
					<img width="32" height="32" src="images/location.png" alt="location" />
					<p>
						${branchAddress}
					</p>
				</div>
				<div class="phone">
					<strong>Điện thoại:</strong> ${branchPhone}
				</div>
			</div>
		`;

    branchList += branchItem;

    var infobox = `<div class='info-box' data-branch="${branchId}">
			<h3>${branchName}</h3>
			<p>${branchAddress}</p>
			<p><strong>Số điện thoại: </strong>${branchPhone}</p>
		</div>`;

    var marker = L.marker([locations[i].lat, locations[i].lng], {
      icon: icon,
      id: branchId,
    }).addTo(map);
    marker.bindPopup(`${infobox}`); //.openPopup();

    markers.push(marker);
  }

  $(".branch-list").html(branchList);
}

function getMarkerById(id) {
  var marker = null;
  for (var i = 0; i < markers.length; i++) {
    if (markers[i].options["id"] == id) {
      marker = markers[i];
      break;
    }
  }
  return marker;
}

function initMap() {
  map = L.map("map").setView([10.823099, 106.829664], 10);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  map.removeControl(map.attributionControl);

  locations = locationCitys;
  findLocation();
}

// Page Ready
(function () {
  $(document).on("click", ".branch-item", function () {
    if (!$(this).hasClass("current")) {
      $(".branch-list .branch-item").removeClass("current");
      $(this).addClass("current");
    }

    var id = $(this).attr("data-branch");
    var marker = getMarkerById(id);
    marker.fire("click");
  });

  // Open select
  $(document).on("click", ".select__header--branch", function (e) {
    var box = $(this).parent();
    if (box.hasClass("open__select")) {
      box.removeClass("open__select");
    } else {
      $(".select--branch").removeClass("open__select");
      box.addClass("open__select");
    }
  });

  $(document).on("click", ".select__item--branch", function (e) {
    var that = $(this);
    var box = $(this).parent().parent().parent();
    var target = $(this).attr("data-value");

    if (!that.hasClass("selected")) {
      box.find("li").removeClass("selected");
      that.addClass("selected");
      box.removeClass("open__select");

      box.find(".select__input--branch").html(that.text());

      if (target === "none") {
        locations = locationCitys;
      } else {
        locations = locationCitys.filter(
          (location) => location.cityId == +target
        );
      }

      findLocation();
    }
  });

  $(document).on("keyup", "#branch__input", function (e) {
    e.stopPropagation();

    if (e.keyCode == 13) {
      e.preventDefault();
      $(".branch-search--but").trigger("click");
    }
  });

  $(document).on("click", ".branch-search--but", function (e) {
    var that = $("#branch__input");
    var text_search = change_alias(that.val());
    if (text_search === "") {
      locations = locationCitys;
    } else {
      text_search = text_search.toLowerCase();
      locations = locationCitys.filter(
        (location) =>
          change_alias(location.name).toLowerCase().indexOf(text_search) > -1 ||
          change_alias(location.cityName).toLowerCase().indexOf(text_search) >
            -1 ||
          change_alias(location.cityShortName)
            .toLowerCase()
            .indexOf(text_search) > -1 ||
          change_alias(location.address).toLowerCase().indexOf(text_search) >
            -1 ||
          change_alias(location.phone).toLowerCase().indexOf(text_search) > -1
      );
    }
    that.val("");
    that.blur();
    findLocation();
  });

  initMap();
})();

// ==============================
// KHỞI TẠO MAP
// ==============================
const map = L.map("map").setView([21.0285, 105.8542], 12);

let stationMarkers = [];

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

let userLat = null;
let userLng = null;
let routingControl = null;

// ==============================
// LOAD STATION
// ==============================
async function loadStations(apiUrl = "/stations/station-data") {
  try {
    clearMarkers();

    const res = await fetch(apiUrl);
    const stations = await res.json();

    const listContainer = document.getElementById("station-list");
    listContainer.innerHTML = "";

    stations.forEach((st) => {
      if (!st.lat || !st.lng) return;

      const marker = L.marker([st.lat, st.lng]).addTo(map);
      stationMarkers.push(marker);

      const fuelNames = st.FuelTypes.map((f) => f.fuel_name).join(", ");

      // Popup
      marker.bindPopup(`
        <b>${st.name}</b><br>
        ${st.address}<br>
        📞 ${st.phone}<br>
        ⏰ Giờ hoạt động: ${st.hours}<br>
        ⛽ Loại xăng: ${fuelNames}<br>
        🚗 Dịch vụ: ${st.services || ""}<br>
        🏪 Thương hiệu: ${st.brand.name}<br>

        <button class="route-button"
          data-lat="${st.lat}"
          data-lng="${st.lng}">
          📍 Chỉ đường
        </button>
      `);

      marker.bindTooltip(st.name, {
        permanent: true,
        direction: "top",
        offset: [0, -10],
        className: "station-label",
      });

      // Khi mở popup thì bind sự kiện click vào nút chỉ đường
      marker.on("popupopen", function () {
        const btn = document.querySelector(".route-button");
        if (!btn) return;

        btn.onclick = () => {
          getRoute(parseFloat(btn.dataset.lat), parseFloat(btn.dataset.lng));
        };
      });

      // Render danh sách
      const item = document.createElement("div");
      item.classList.add("station-item");
      item.innerHTML = `
        <h3>${st.name}</h3>
        <p><b>Địa chỉ:</b> ${st.address}</p>
        <p><b>⛽Nhiên liệu:</b> ${fuelNames}</p>
        <p><b>🚗Dịch vụ:</b> ${st.services || "Không rõ"}</p>
        <p><b>🏪Thương hiệu:</b> ${st.brand.name}</p>

        <button class="view-map-btn"
          data-lat="${st.lat}" 
          data-lng="${st.lng}">
          📍 Xem trên bản đồ
        </button>
      `;

      item.querySelector(".view-map-btn").onclick = () => {
        map.setView([st.lat, st.lng], 17);
        marker.openPopup();
      };

      listContainer.appendChild(item);
    });
  } catch (error) {
    console.error("Lỗi load stations:", error);
  }
}

// ==============================
// CLEAR MARKERS
// ==============================
function clearMarkers() {
  stationMarkers.forEach((m) => map.removeLayer(m));
  stationMarkers = [];
}

// ==============================
// LẤY GPS NGƯỜI DÙNG
// ==============================
function locateUser() {
  if (!navigator.geolocation) {
    alert("Trình duyệt không hỗ trợ GPS!");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      userLat = pos.coords.latitude;
      userLng = pos.coords.longitude;

      console.log("Độ chính xác:", pos.coords.accuracy, "m");

      map.setView([userLat, userLng], 15);

      L.circleMarker([userLat, userLng], {
        radius: 10,
        color: "#FF4444",
        fillColor: "#FF0000",
        fillOpacity: 0.7,
      })
        .addTo(map)
        .bindPopup("📍 Vị trí của bạn")
        .openPopup();
    },
    (err) => {
      console.error(err);
      alert("Không thể lấy vị trí!");
    },
    {
      enableHighAccuracy: true, // yêu cầu GPS chính xác cao
      timeout: 10000, // tối đa 10s
      maximumAge: 0, // không dùng vị trí cũ
    }
  );
}

// ==============================
// CHỈ ĐƯỜNG
// ==============================
function getRoute(destLat, destLng) {
  map.closePopup();

  if (!userLat || !userLng) {
    alert("Không có vị trí của bạn — bật GPS!");
    return;
  }

  if (routingControl) map.removeControl(routingControl);

  routingControl = L.Routing.control({
    waypoints: [L.latLng(userLat, userLng), L.latLng(destLat, destLng)],
    lineOptions: { weight: 8, addWaypoints: false },
    draggableWaypoints: false,
    createMarker: () => null,
  }).addTo(map);

  // ➜ HIỆN NÚT TẮT CHỈ ĐƯỜNG
  document.getElementById("clear-route-btn").style.display = "block";

  routingControl.on("routesfound", (e) => {
    const summary = e.routes[0].summary;
    const distanceKm = (summary.totalDistance / 1000).toFixed(2);

    const points = e.routes[0].coordinates;
    const midPoint = points[Math.floor(points.length / 2)];

    if (window.routeInfoMarker) map.removeLayer(window.routeInfoMarker);

    window.routeInfoMarker = L.marker([midPoint.lat, midPoint.lng], {
      opacity: 0,
    })
      .addTo(map)
      .bindTooltip(`📏 ${distanceKm} km`, {
        permanent: true,
        direction: "top",
        className: "route-info-tooltip",
      })
      .openTooltip();
  });
}

// TẮT CHỈ ĐƯỜNG
// ==============================
function clearRoute() {
  if (routingControl) {
    map.removeControl(routingControl);
    routingControl = null;
  }

  if (window.routeInfoMarker) {
    map.removeLayer(window.routeInfoMarker);
    window.routeInfoMarker = null;
  }

  map.closePopup();

  // ẨN NÚT TẮT CHỈ ĐƯỜNG
  document.getElementById("clear-route-btn").style.display = "none";
}

// ==============================
// FILTER
// ==============================
document.getElementById("filter-btn").onclick = () => {
  const fuel_id = document.getElementById("loaixang").value;
  const brand_id = document.getElementById("thuonghieu").value;
  const service = document.getElementById("dichvu").value;
  const nearby = document.getElementById("nearby").checked;

  const params = new URLSearchParams();

  if (fuel_id) params.append("fuel_id", fuel_id);
  if (brand_id) params.append("brand_id", brand_id);
  if (service) params.append("service", service);

  if (nearby) {
    if (!userLat || !userLng) {
      alert("Bạn cần bật GPS để lọc <2km");
      return;
    }
    params.append("nearby", "true");
    params.append("lat", userLat);
    params.append("lng", userLng);
  }

  const apiUrl = "/stations/station-data?" + params.toString();
  console.log("Fetching:", apiUrl);

  loadStations(apiUrl);
};

document.getElementById("clear-route-btn").addEventListener("click", () => {
  clearRoute();
});

// ==============================
// CHẠY LÚC MỞ TRANG
// ==============================
loadStations();
locateUser();

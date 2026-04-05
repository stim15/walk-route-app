// 地図を初期化
const map = L.map('map').setView([35.681236, 139.767125], 13);

// 地図タイル
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// 状態を入れておく箱
let home = null;
let homeMaker =null;
let routeLine = null;

// 地図おクリックしたらスタート地点を設定
map.on('click', function(e) {
  const lat = e.latlng.lat;
  const lng = e.latlng.lng;

  home = [lat, lng];
  
  if (homeMaker) {
    map.removeLayer(homeMaker);
  }

  homeMaker = L.marker(home).addTo(map);
});

// ルート生成
function generateRoute() {
  if (!home) {
    alert("先に地図をクリックしてスタート地点を決めてください！");
    return;
  }

  const centerLat = home[0];
  const centerLng = home[1];

  const radiusKm = parseFloat(document.getElementById("radiusInput").value) || 3;
  const radius = radiusKm / 111;

  const numpoints = 180;
  const latRad = centerLat * Math.PI / 180;
  const lngScale = Math.cos(latRad);
  
  const points = [];
  
  for (let i = 0; i <= numPoints; i++) {
    const angle = (i / numPoints) * 2 * Math.PI;
    
    const lat = centerLat + radius * Math.cos(angle);
    const lng = centerLng + (radius * Math.sin(angle)) / lngScale;
    
    points.push([lat, lng]);
  }

  if (routeLine) {
    map.removeLayer(routeLine);
  }

  routeLine = L.polyline(points, { color: "blue" }).addTo(map);
}


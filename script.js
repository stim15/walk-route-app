// 地図を初期化
const map = L.map('map').setView([35.681236, 139.767125], 13);

// 地図タイル
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// 管理用
let points = [];
let polyline = null;
let markers = [];
let home = null;

// クリックイベント（1つだけ！）
map.on('click', function(e) {
  const latlng = e.latlng;

  // 最初の1回だけホームにする
  if (!home) {
    home = [latlng.lat, latlng.lng];
    alert("ここをスタート地点に設定しました！");
  }

  const marker = L.marker([latlng.lat, latlng.lng]).addTo(map);
  markers.push(marker);

  points.push([latlng.lat, latlng.lng]);

  if (polyline) {
    map.removeLayer(polyline);
  }

  polyline = L.polyline(points, { color: 'red' }).addTo(map);
});

// ルート生成
function generateRoute() {
  if (!home) {
    alert("先にスタート地点をクリックしてください！");
    return;
  }

  const centerLat = home[0];
  const centerLng = home[1];

  // 既存削除
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  if (polyline) {
    map.removeLayer(polyline);
  }

  // 中心マーカー
  const centerMarker = L.marker([centerLat, centerLng]).addTo(map);
  markers.push(centerMarker);

  const radius = 0.01;
  const numPoints = 40;

  const latRad = centerLat * Math.PI / 180;
  const lngScale = Math.cos(latRad);

  points = [];

  for (let i = 0; i <= numPoints; i++) {
    const angle = (i / numPoints) * 2 * Math.PI;

    const lat = centerLat + radius * Math.cos(angle);
    const lng = centerLng + (radius * Math.sin(angle)) / lngScale;

    points.push([lat, lng]);
  }

  polyline = L.polyline(points, { color: 'blue' }).addTo(map);
}

// 距離を計算
function getDistance(p1, p2) {
    const R = 6371; // 地球の半径(km)
  
    const dLat = (p2[0] - p1[0]) * Math.PI / 180;
    const dLng = (p2[1] - p1[1]) * Math.PI / 180;
  
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(p1[0] * Math.PI/180) *
      Math.cos(p2[0] * Math.PI/180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
    return R * c;
  }

// 合計距離を計算
function getTotalDistance(points) {
    let total = 0;

    for (let i = 0; i < points.length - 1; i++) {
      total += getDistance(points[i], points[i+1]);
    }
  
    return total;
}

// 合計距離を計算
const total = getTotalDistance(points);
alert("距離: " + total.toFixed(2) + " km");
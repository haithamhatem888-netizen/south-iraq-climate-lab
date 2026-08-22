// auto-update.js - نظام التحديث التلقائي لمختبر مناخ جنوب العراق
// المطور: هيثم حاتم - الناصرية 2026
// يعمل بدون API Key لـ NASA، ويحتاج مفتاح مجاني لـ OpenWeather

const CITIES = {
  basra: { lat: 30.50, lon: 47.78, name: "البصرة" },
  nasiriyah: { lat: 31.05, lon: 46.26, name: "الناصرية" },
  samawa: { lat: 31.33, lon: 45.28, name: "السماوة" },
  amarah: { lat: 31.84, lon: 47.14, name: "العمارة" }
};

// 1- NASA POWER - مجاني بدون مفتاح - حرارة وأمطار يومية
async function fetchNASA(cityKey) {
  const city = CITIES[cityKey];
  const end = new Date().toISOString().split('T')[0].replace(/-/g,'');
  const start = new Date(Date.now() - 30*24*3600*1000).toISOString().split('T')[0].replace(/-/g,'');
  const url = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M,PRECTOTCORR&community=AG&longitude=${city.lon}&latitude=${city.lat}&start=${start}&end=${end}&format=JSON`;
  try {
    const res = await fetch(url);
    const json = await res.json();
    const temps = Object.values(json.properties.parameter.T2M);
    const rains = Object.values(json.properties.parameter.PRECTOTCORR);
    return {
      city: city.name,
      avg_temp_last30: (temps.reduce((a,b)=>a+b,0)/temps.length).toFixed(1),
      max_temp_last30: Math.max(...temps).toFixed(1),
      total_rain_last30: rains.reduce((a,b)=>a+b,0).toFixed(1),
      last_update: new Date().toISOString(),
      source: "NASA POWER"
    };
  } catch(e){ return { error: e.message, city: city.name }; }
}

// 2- OpenWeather - يحتاج مفتاح مجاني
async function fetchOpenWeather(cityKey, apiKey) {
  if(!apiKey) return { note: "ضع مفتاح OpenWeather في config.js" };
  const city = CITIES[cityKey];
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${apiKey}&units=metric&lang=ar`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return {
      city: city.name,
      temp_now: data.main.temp,
      feels_like: data.main.feels_like,
      humidity: data.main.humidity,
      source: "OpenWeather"
    };
  } catch(e){ return { error: e.message }; }
}

// 3- تجميع كل البيانات وحفظها
async function updateAll() {
  console.log("🔄 بدأ التحديث التلقائي...");
  const results = {};
  for(let key of Object.keys(CITIES)){
    results[key] = await fetchNASA(key);
    await new Promise(r=>setTimeout(r,1000)); // تجنب حظر NASA
  }
  // حفظ في ملف
  const finalData = {
    last_auto_update: new Date().toISOString(),
    developer: "هيثم حاتم - الناصرية",
    data: results,
    note: "يتم التحديث تلقائياً كل أسبوع عبر GitHub Actions"
  };
  
  // في المتصفح: حفظ في localStorage
  if(typeof localStorage !== 'undefined'){
    localStorage.setItem('south_iraq_climate_auto', JSON.stringify(finalData));
    console.log("✅ تم حفظ البيانات:", finalData);
    return finalData;
  }
  // في Node.js: حفظ في ملف
  return finalData;
}

// تشغيل تلقائي عند فتح الخريطة
if(typeof window !== 'undefined'){
  window.updateClimateData = updateAll;
  console.log("💡 اكتب updateClimateData() في Console للتحديث اليدوي");
}

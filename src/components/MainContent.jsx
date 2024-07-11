/* eslint-disable react-hooks/exhaustive-deps */
import Grid from "@mui/material/Unstable_Grid2";
import Divider from "@mui/material/Divider";
import Prayer from "./Prayer";
import { Stack } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import "moment/dist/locale/ar-dz";
moment.locale("ar");
export default function MainContent() {
  const availableCities = [
    {
      displayName: "القاهرة",
      apiName: "Cairo",
    },
    {
      displayName: "الاسكندرية",
      apiName: "Alexandria",
    },
    {
      displayName: "الجيزة",
      apiName: "Giza",
    },
    {
      displayName: "الزقازيق",
      apiName: "Zagazig",
    },
    {
      displayName: "أسوان",
      apiName: "Aswan",
    },
  ];
  const [city, setCity] = useState(availableCities[0]);
  const handleCityChange = (event) => {
    const cityObject = availableCities.find((city) => {
      return city.apiName == event.target.value;
    });
    setCity(cityObject);
  };

  const [timings, setTimings] = useState({
    Fajr: "00:00",
    Dhuhr: "00:00",
    Asr: "00:00",
    Maghrib: "00:00",
    Isha: "00:00",
  });
  const [today, setToday] = useState("");
  const getTimings = async () => {
    const response = await axios.get(
      `https://api.aladhan.com/v1/timingsByCity/10-07-2024?country=EG&city=${city.apiName}`
    );
    setTimings(response.data.data.timings);

    // console.log(response.data);
  };
  useEffect(() => {
    getTimings();
  }, [city]);

  const [nextPrayerIndex, setNextPrayerIndex] = useState(0);
  const prayersArray = [
    { key: "Fajr", displayName: "الفجر" },
    { key: "Dhuhr", displayName: "الظهر" },
    { key: "Asr", displayName: "العصر" },
    { key: "Sunset", displayName: "المغرب" },
    { key: "Isha", displayName: "العشاء" },
  ];
  const [remainingTime, setRemainingTime] = useState("00:00:00");
  const setupCountdownTimer = () => {
    const momentNow = moment();

    let prayerIndex = 0;

    if (
      momentNow.isAfter(moment(timings["Fajr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Dhuhr"], "hh:mm"))
    ) {
      prayerIndex = 1;
    } else if (
      momentNow.isAfter(moment(timings["Dhuhr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Asr"], "hh:mm"))
    ) {
      prayerIndex = 2;
    } else if (
      momentNow.isAfter(moment(timings["Asr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Maghrib"], "hh:mm"))
    ) {
      prayerIndex = 3;
    } else if (
      momentNow.isAfter(moment(timings["Maghrib"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Isha"], "hh:mm"))
    ) {
      prayerIndex = 4;
    } else {
      prayerIndex = 0;
    }
    setNextPrayerIndex(prayerIndex);
    const nextPrayerObject = prayersArray[prayerIndex];
    const nextPrayerTime = timings[nextPrayerObject.key];
    const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm");

    let remainingTime = moment(nextPrayerTime, "hh:mm").diff(momentNow);
    if (remainingTime < 0) {
      const midnightDiff = moment("23:59:59", "hh:mm:ss").diff(momentNow);
      const fajrToMidnightDiff = nextPrayerTimeMoment.diff(
        moment("00:00:00", "hh:mm:ss")
      );

      const totalDifference = midnightDiff + fajrToMidnightDiff;

      remainingTime = totalDifference;
    }

    const durationRemainingTime = moment.duration(remainingTime);

    setRemainingTime(
      `${durationRemainingTime.seconds()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.hours()}`
    );
  };

  useEffect(() => {
    let interval = setInterval(() => {
      setupCountdownTimer();
    }, 1000);
    const t = moment();
    setToday(t.format("MMM Do YYYY | h:mm"));
    return () => {
      clearInterval(interval);
    };
  }, [timings]);
  return (
    <>
      <Grid container columns={{ xs: 2, sm: 6, md: 12 }} >
        <Grid xs={6}>
          <div>
            <h2>{today}</h2>
            <h1>{city.displayName}</h1>
          </div>
        </Grid>
        <Grid xs={6}>
          <div>
            <h2>
              متبقي حتى صلاة {""} {prayersArray[nextPrayerIndex].displayName}
            </h2>
            <h1>{remainingTime}</h1>
          </div>
        </Grid>
      </Grid>
      <Divider style={{ borderColor: "white", opacity: "0.2" }} />
      <Grid
        container
        columns={{ xs: 6, sm: 20, md: 36 }}
        direction={{ xs: "column", sm: "row" }}
        justifyContent={{ xs: "flex-start", md: "space-between" }}
        alignItems={{ xs: "center" }}
        style={{ marginTop: "30px", marginBottom: "30px" }}
        spacing={{ xs: 3, sm: 2, md: 1 }}>
        <Grid xs={6}>
          <Prayer
            name="الفجر"
            time={timings.Fajr}
            imgUrl="https://wepik.com/api/image/ai/9a07baa7-b49b-4f6b-99fb-2d2b908800c2"
          />
        </Grid>
        <Grid xs={6}>
          <Prayer
            name="الظهر"
            time={timings.Dhuhr}
            imgUrl="https://wepik.com/api/image/ai/9a07bb45-6a42-4145-b6aa-2470408a2921"
          />
        </Grid>
        <Grid xs={6}>
          <Prayer
            name="العصر"
            time={timings.Asr}
            imgUrl="https://wepik.com/api/image/ai/9a07bb90-1edc-410f-a29a-d260a7751acf"
          />
        </Grid>
        <Grid xs={6}>
          <Prayer
            name="المغرب"
            time={timings.Maghrib}
            imgUrl="https://wepik.com/api/image/ai/9a07bbe3-4dd1-43b4-942e-1b2597d4e1b5"
          />
        </Grid>
        <Grid xs={6}>
          <Prayer
            name="العشاء"
            time={timings.Isha}
            imgUrl="https://wepik.com/api/image/ai/9a07bc25-1200-4873-8743-1c370e9eff4d"
          />
        </Grid>
      </Grid>
      <Stack direction="row" justifyContent={"center"}>
        <FormControl
          sx={{
            marginBottom: 4,
            minWidth: "20%",
            width: { xs: "50%", sm: "20%" },
          }}>
          <InputLabel id="demo-simple-select">
            <span style={{ color: "white" }}>المدينة</span>
          </InputLabel>
          <Select
            labelId="demo-simple-select"
            id="demo-simple-select"
            value={city.apiName}
            label="prayer"
            onChange={handleCityChange}
            sx={{ color: "white", minWidth: "20%" }}>
            {availableCities.map((city) => {
              return (
                <MenuItem value={city.apiName} key={city.apiName}>
                  {city.displayName}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Stack>
    </>
  );
}

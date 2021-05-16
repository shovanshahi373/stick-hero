export const STICK_STATES = {
  ERECT: "erect",
  FALLING: "falling",
  FALLEN: "fallen",
};

export const RESULTS = {
  SUCCESS: "success",
  FAIL: "fail",
  PENDING: "pending",
};

export const BACKGROUNDS = [
  {
    spectrum: ["green", "yellow"],
    images: [
      {
        name: "mountain.png",
        x: "",
        y: "",
        width: "",
        height: "",
      },
    ],
  },
  {
    spectrum: ["black", "blue"],
    images: [
      {
        name: "moon.png",
        x: "",
        y: "",
        width: "90",
        height: "90",
      },
    ],
  },
];

Object.freeze(STICK_STATES);
Object.freeze(RESULTS);

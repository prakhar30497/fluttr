const postShortDate = {
  month: "long",
  day: "numeric",
};
const postLongDate = {
  dateStyle: "medium",
  timeStyle: "short",
};
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  // dateStyle: "medium",
  // timeStyle: "short",
  month: "long",
  day: "numeric",
});

export const convertTime = (time) => {
  const currentTime = Date.now();
  const desiredTime = new Date(time);
  const timeDifference = currentTime - desiredTime;

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    if (hours < 1) {
      return minutes + "m";
    } else {
      return hours + "h";
    }
  } else {
    return dateFormatter.format(Date.parse(time));
  }
};

export const stringToColor = (string) => {
  let hash = 0;
  let i;

  if (!string) return "#123456";
  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
};

export const stringAvatar = (name, profile) => {
  return profile
    ? {
        sx: {
          bgcolor: stringToColor(name),
          width: 72,
          height: 72,
        },
        children: `${name.split(" ")[0][0].toUpperCase()}`,
      }
    : {
        sx: {
          bgcolor: stringToColor(name),
        },
        children: `${name.split(" ")[0][0].toUpperCase()}`,
      };
};

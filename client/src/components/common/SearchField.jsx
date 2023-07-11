import React, { useEffect, useRef, useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { debounce } from "../../../utils/index";

const SearchField = ({ handleSearch, searchResult, addUser }) => {
  // const [searchResult, setSearchResult] = useState([]);
  // const [anchorEl, setAnchorEl] = useState(null);
  // const [searchText, setSearchText] = useState("");

  // const debouncedSearch = debounce((value, currentTarget) => {
  //   handleSearch(value).then((response) => {
  //     setSearchResult(response.users); // Assuming the API response is an array of data
  //     setAnchorEl(currentTarget);
  //   });
  // }, 500);

  // const onSearch = (e) => {
  //   const value = e.target.value;
  //   setSearchText(value);
  //   debouncedSearch(value, e.currentTarget);
  // };

  // const handleClose = () => {
  //   setAnchorEl(null);
  // };

  // const openSearchResultPopper = Boolean(searchText) && Boolean(anchorEl);

  const Search = styled("div")(({ theme }) => ({
    position: "relative",
    border: "1px solid #e4e4e7",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "auto",
    },
  }));

  const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
      id: "searchInput",
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("md")]: {
        width: "20ch",
      },
    },
  }));
  return (
    <>
      {/* <Search sx={{ marginRight: "auto" }}>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          id="searchUser"
          placeholder="Search…"
          inputProps={{ "aria-label": "search" }}
          onChange={(e) => onSearch(e)}
          // onClick={(event) => setAnchorEl(event.currentTarget)}
          value={searchText}
        />
      </Search>
      <Popover
        open={openSearchResultPopper}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Typography sx={{ p: 2 }}>The content of the Popover.</Typography>
      </Popover> */}
      <Autocomplete
        freeSolo
        id="search-input"
        disableClearable
        options={searchResult}
        getOptionLabel={(option) => option.handle}
        onInputChange={(event, value) => handleSearch(value)}
        onChange={(event, value) => addUser(value)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search"
            InputProps={{
              ...params.InputProps,
              type: "search",
            }}
          />
        )}
      />
    </>
  );
};

export default SearchField;

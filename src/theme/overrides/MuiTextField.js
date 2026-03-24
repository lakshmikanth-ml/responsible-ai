// export const MuiTextField = {
//   styleOverrides: {
//     root: ({ theme }) => ({
//       '& .MuiOutlinedInput-root': {
//         borderRadius: '8px !important'
//       },
//       '& .MuiInputBase-root': {
//         // rounded corners
//         //  backgroundColor: theme.palette.background.paper,
//       },

//       '& .MuiOutlinedInput-notchedOutline': {
//         //  borderColor: theme.palette.grey[300],
//       },

//       '&:hover .MuiOutlinedInput-notchedOutline': {
//         // borderColor: theme.palette.primary.main,
//       },

//       '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
//         //  borderColor: theme.palette.primary.dark,
//         // borderWidth: 2,
//       },

//       '& .MuiInputBase-input': {
//         // padding: '10px 14px',

//         // padding: "10px 8px",

//         // fontSize: 14,
//       },

//       "& .MuiInputBase-sizeSmall": {
//         // height: 40,
//         // padding: "6px 0px",
//         // fontSize: "13px",
//       },

//       // "& .MuiInputBase-root.MuiInputBase-sizeMedium": {
//       //   height: 42,
//       //   // padding: "19px 10px",
//       //   // fontSize: "14px",
//       // },

//       // "& .MuiInputBase-root.MuiInputBase-sizeLarge": {
//       //   height: 44,
//       //   padding: "8px 14px",
//       //   fontSize: "15px",
//       // },
//     }),
//   },
// };


export const MuiTextField = {
  styleOverrides: {
    root: ({ theme }) => ({
      '& .MuiOutlinedInput-root': {
        borderRadius: '8px !important'
      },

          "& input[type='search']::-webkit-search-cancel-button": {
      display: "none",
    },
      '& .MuiInputBase-root': {
        // rounded corners
        //  backgroundColor: theme.palette.background.paper,
      },

      '& .MuiOutlinedInput-notchedOutline': {
        //  borderColor: theme.palette.grey[300],
      },

      '&:hover .MuiOutlinedInput-notchedOutline': {
        // borderColor: theme.palette.primary.main,
      },

      '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
        //  borderColor: theme.palette.primary.dark,
        // borderWidth: 2,
      },

      '& .MuiInputBase-input': {
        // padding: '10px 14px',

        // padding: "10px 8px",

        // fontSize: 14,
      },

      "& .MuiInputBase-sizeSmall": {
        // height: 40,
        // padding: "6px 0px",
        // fontSize: "13px",
      },

      // "& .MuiInputBase-root.MuiInputBase-sizeMedium": {
      //   height: 42,
      //   // padding: "19px 10px",
      //   // fontSize: "14px",
      // },

      // "& .MuiInputBase-root.MuiInputBase-sizeLarge": {
      //   height: 44,
      //   padding: "8px 14px",
      //   fontSize: "15px",
      // },
    }),
  },
};







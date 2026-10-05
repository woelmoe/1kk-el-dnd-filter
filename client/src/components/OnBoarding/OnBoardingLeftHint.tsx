import { Box, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

export function OnBoardingLeftHint() {
  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          top: '15%',
          left: '5%',
          width: '40%',
          height: '60%',
          border: '2px dashed #fff',
          borderRadius: 2,
          zIndex: 1301,
          pointerEvents: 'none'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            width: '400px',
            left: 'calc(100% + 20px)',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            zIndex: 1302,
            pointerEvents: 'none'
          }}
        >
          <ArrowBackIcon sx={{ color: '#fff', fontSize: 40 }} />
          <Typography
            sx={{
              color: '#fff',
              fontWeight: 600,
              fontSize: 20,
              textShadow: '0 1px 4px rgba(0,0,0,0.6)'
            }}
          >
            Двойной клик по элементу — добавить в правый
          </Typography>
        </Box>
      </Box>
    </>
  )
}

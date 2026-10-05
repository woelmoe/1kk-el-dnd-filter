import { Box, Typography } from '@mui/material'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'

export function OnBoardingFabHint() {
  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          bottom: 53,
          right: 'calc(50% + 55px)',
          width: 60,
          height: 60,
          borderRadius: '50%',
          border: '2px dashed #fff',
          zIndex: 1301,
          pointerEvents: 'none'
        }}
      />

      <Box
        sx={{
          position: 'fixed',
          bottom: 120,
          right: 'calc(50% + 65px)',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          zIndex: 1302,
          pointerEvents: 'none'
        }}
      >
        <Typography
          sx={{
            color: '#fff',
            fontWeight: 600,
            fontSize: 20,
            textShadow: '0 1px 4px rgba(0,0,0,0.6)',
            textAlign: 'right'
          }}
        >
          Или нажмите + для ввода ID
        </Typography>
        <ArrowDownwardIcon sx={{ color: '#fff', fontSize: 40 }} />
      </Box>
    </>
  )
}

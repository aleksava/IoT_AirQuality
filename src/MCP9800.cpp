#include "arduino.h"
#include <wire.h>
#include "MCP9800.h"


float readTemp()
{
  uint8_t upper = 0;
  uint8_t lower = 0;
  Wire.beginTransmission(MCP9800_ADDRESS);
  Wire.write(MCP9800_REG_ADDR_TEMPERATURE);
  Wire.endTransmission();

  Wire.requestFrom(MCP9800_ADDRESS, 2);
  while(Wire.available()) 
  {
    upper = Wire.read();
    lower = Wire.read();
  }
  return ((upper << 8 | lower) >> 4) / 16.0;
}

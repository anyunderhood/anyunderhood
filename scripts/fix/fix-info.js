import fixer from "./fixer";
import { merge } from "ramda";


fixer('info', 'dump-old', 'dump-old',
  (content) =>
    merge(
      content,
      {
        time_zone_offset: 0,
        geometry: { lat: 0.0, lng: 0.0 }
      }
    )
)

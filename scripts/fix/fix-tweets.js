import fixer from "./fixer";
import { merge } from "ramda";


fixer('tweets', 'dump-old', 'dump-old',
  content => content
)

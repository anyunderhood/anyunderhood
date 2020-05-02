import fixer from "./fixer";
import { merge } from "ramda";


fixer('tweets', 'dump-old', 'dump',
  content => content
)

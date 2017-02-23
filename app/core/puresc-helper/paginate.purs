module Main where

import Prelude (map, (<=), ($), show, (>), (&&), (<>), (-), (>=), otherwise, (+))
import Data.Array ((..))

paginate :: Int -> Int -> Array String
paginate page activep
    | page <= 10 = map show $ 1..page
    | page > 10 && activep <= 5 = (map show $ 1..7) <> [".."] <> (map show [page-1, page])
    | activep >= page -5 = (map show $ 1..2) <> [".."] <> (map show $ (page-6)..page)
    | otherwise = (map show $ 1..2) <> [".."] <> (map show $ (activep-1)..(activep+2)) <> [".."] <> (map show [page-1, page])


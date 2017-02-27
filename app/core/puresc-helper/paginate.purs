module Pagination where

import Prelude (map, (==), (<=), ($), show, (>), (&&), (<>), (-), (>=), otherwise, (+))
import Data.Array ((..))
import Data.Show (class Show)

mapToString :: forall a. ( Show a ) => Array a -> Array String
mapToString = map show

paginate :: Int -> Int -> Array String
paginate page activep
    | page == 0                 = []
    | page <= 10                = mapToString $ 1..page
    | page > 10 && activep <= 5 = (mapToString $ 1..7) <> ["..."] <> (mapToString [page-1, page])
    | activep >= page -5        = (mapToString $ 1..2) <> ["..."] <> (mapToString $ (page-6)..page)
    | otherwise                 = (mapToString $ 1..2)
                                    <> ["..."]
                                    <> (mapToString $ (activep-1)..(activep+2))
                                    <> ["..."]
                                    <> (mapToString [page-1, page])


photoVan12 <- read.csv("12h_photovanillin_AF.csv")
names(photoVan12) <- tolower(names(photoVan12))

library(dplyr)
photoVan12 %>% 
  group_by(kmd.coo.)
#  summarise(count = n())

#unique ones
unique_COO <- length(unique(photoVan12$kmd.coo.))

GroupCOO <- select(photoVan12, -c(km.ch2., kmd.ch2.,km.h2o.:kmd.c8h8o3.));
GroupCOO <-arrange(GroupCOO, kmd.coo.)

#to see how many distinct number of inputs in that column
n_distinct(GroupCOO, GroupCOO$kmd.coo.)

DaGroup <- split(GroupCOO,GroupCOO$kmd.coo.)

COL <- fields::designer.colors(n = length(DaGroup), col = c('cyan', 'purple'))

first <- TRUE
png("plot.png")
for (i in 1:length(DaGroup)) {
  if (length(DaGroup[[i]]$km.coo.) <= 1) {
    next
  }

  if (first) {
    print("plotting first")
    plot(DaGroup[[i]]$km.coo., DaGroup[[i]]$kmd.coo., type="o", col = COL[i], xlim=c(min(GroupCOO$km.coo.), max(GroupCOO$km.coo.)), ylim=c(min(GroupCOO$kmd.coo.), max(GroupCOO$kmd.coo.)))
    first <- FALSE
    next
  }
  print("plotting next")
  points(DaGroup[[i]]$km.coo., DaGroup[[i]]$kmd.coo., col = COL[i])
}
dev.off()

#ggplot(DaGroup[[20]], aes(x = DaGroup[[20]], y = DaGroup[[20]][["kmd.coo."]]))+ 
#  geom_point() +
#  theme_minimal() +
#  labs(title = "KMD [CH2]", x = "Kendrick Mass [CH2]", y = "Kendrick Mass Defect [CH2]")





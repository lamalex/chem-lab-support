parse_args <- function(args) {
    DEFAULT_CONTOUR = 32

    if (is.na(args[1]) || is.na(args[2])) {
        print("First 2 arguments must be appropriately formatted csv files.")
        quit(save = "no", status = 69)
    }
    
    contour <- ifelse(is.na(args[3]), DEFAULT_CONTOUR, args[3])
    parsed <- list("file1" = args[1], "file2" = args[2], "contour" = contour)
    return(parsed)
}

load_csv_to_matrix <- function(file_path) {
    csv <- read.csv(file_path, row.names = 1, check.names = FALSE)
    return(data.matrix(csv, rownames.force = NA))
}

main <- function() {
    args <- parse_args(commandArgs(trailingOnly = TRUE))
    mat1 = load_csv_to_matrix(args$file1)
    mat2 = load_csv_to_matrix(args$file2)
   
    library("stringr")
    library("corr2D")
    twod <- corr2d(mat1, mat2, corenumber = parallel::detectCores())
    
    pdf(str_interp("corr2d-${Sys.time()}.pdf"))
    plot_corr2d(twod, N = args$contour)
    dev.off()
}

main()

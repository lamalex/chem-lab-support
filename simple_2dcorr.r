parse_args <- function(args) {
    DEFAULT_CONTOUR = 32

    if (is.na(args[1]) || is.na(args[2])) {
        print("First 2 arguments must be appropriately formatted csv files.")
        quit(save = "no", status = 69)
    }
    
    contour <- ifelse(is.na(args[3]), DEFAULT_CONTOUR, as.numeric(args[3]))
    parsed <- list("file1" = args[1], "file2" = args[2], "contour" = contour)
    return(parsed)
}

load_csv_to_matrix <- function(file_path) {
    csv <- read.csv(file_path, row.names = 1, check.names = FALSE)
    return(data.matrix(csv, rownames.force = NA))
}

plot_corr2d_rev <-
    function(Obj, what = Re(Obj$FT), specx = Obj$Ref1, specy = Obj$Ref2,
             xlim = NULL, ylim = NULL,
             xlab = expression(nu[1]), ylab = expression(nu[2]),
             Contour = TRUE, axes = 3, Legend = TRUE, N = 20,
             zlim = NULL, Cutout = NULL, col = par("col"), lwd = par("lwd"), 
             lwd.axis = NULL, lwd.spec = NULL, cex.leg = NULL,
             at.xaxs = NULL, label.xaxs = TRUE,
             at.yaxs = NULL, label.yaxs = TRUE,
             line.xlab = 3.5, line.ylab = 3.5, ...)
    {
        # check user input for errors -----------------------------------------
        if (!is.null(xlim)) {
            if (length(xlim) != 2 || is.complex(xlim) || xlim[1] > xlim[2]) {
                stop("xlim must have exactly 2 real values or must be NULL.
                     The first value needs to be smaller than the second one.")
            }
        }
        if (!is.null(ylim)) {
            if (length(ylim) != 2 || is.complex(ylim) || ylim[1] > ylim[2]) {
                stop("ylim must have exactly 2 real values or must be NULL.
                     The first value needs to be smaller than the second one.")
            }
        }
        if (!is.null(zlim)) {
            if (length(zlim) != 2 || is.complex(zlim) || zlim[1] > zlim[2]) {
                stop("zlim must have exactly 2 real values or must be NULL.
                     The first value needs to be smaller than the second one.")
            }
        }
        
        if (!is.logical(Contour)) {
            stop("Contour needs to be logical")
        }
        
        if (axes %in% c(0, 1, 2, 3) == FALSE) {
            stop("axes my only be 0 (no axes), 1 (only bottom axis),
                 2 (only right axis) or 3 (both axes)")
        }
        
        if (!is.logical(Legend)) {
            stop("Legend needs to be logical")
        }
        
        if (N <= 0 || N%%1 != 0) {
            stop("N must be a positive, non-zero integer")
        }
        
        if (!is.null(Cutout)) {
            if (length(Cutout) != 2 || is.complex(Cutout) || Cutout[1] > Cutout[2]) {
                stop("Cutout must have exactly 2 real values or must be NULL.
                     The first value needs to be smaller than the second one.")
            }
        }
        
        par_old <- par(no.readonly = TRUE)
        on.exit(options(par_old), add = TRUE)
        # avoid "invalid screen(1)" error in RStudio --------------------------
        close.screen(all.screens = TRUE)
        graphics::plot.new()
        
        # get graphics parameters from "..."
        getparm <- list(..., lwd = lwd, col = col)
        graphparm <- utils::modifyList(par(), getparm)
        if(is.null(lwd.axis)) {lwd.axis <- graphparm$lwd + 1}
        if(is.null(lwd.spec)) {lwd.spec <- graphparm$lwd}
        if(is.null(cex.leg)) {cex.leg <- graphparm$cex.axis}
        
        # calculate x- and y-window range -------------------------------------
        if (is.null(xlim)) {
            Which1 <- 1:NROW(what)
        } else {
            Which1 <- which(xlim[1] < Obj$Wave1 & Obj$Wave1 < xlim[2])
        }
        
        if (is.null(ylim)) {
            Which2 <- 1:NCOL(what)
        } else {
            Which2 <- which(ylim[1] < Obj$Wave2 & Obj$Wave2 < ylim[2])
        }
        
        # create splitscreen for plotting -------------------------------------
        OFF <- 0.05
        split.screen(rbind(c(0, 0.15 + OFF, 0.15 + OFF, 0.85 - OFF),          # left
                           c(0.15 + OFF, 0.85 - OFF, 0.85 - OFF, 1),          # Spectrum top
                           c(0.15 + OFF, 0.85 - OFF, 0.15 + OFF, 0.85 - OFF), # Main
                           c(0.85 - OFF, 1, 0.15 + OFF, 0.85 - OFF),          # Spectrum Right
                           c(0.15 + OFF, 0.85 - OFF, 0, 0.15 + OFF),          # bottom
                           c(0, 0.15 + OFF, 0.85 - OFF, 1),                   # top left
                           c(0.85 - OFF, 1, 0.85 - OFF, 1)                    # Legend top right
                           )
        )
        
        # plot one dimensional spectra top and left ---------------------------
        if (!is.null(specy)) {
            # Spec right -------------------------------------------------------
            screen(4)
            x = max(specy[Which2]) - specy[Which2]
            par(xaxt = "n", yaxt = "n", mar = c(0, 0, 0, 0), bty = "n", yaxs = "i")
            plot(x = x, y = Obj$Wave2[Which2], 
                 col = graphparm$col, type = "l", lwd = lwd.spec, ann = FALSE, 
                 xlim = rev(range(x))
            )
        }
        
        if (!is.null(specx)) {
            # Spec top -------------------------------------------------------
            screen(2)
            par(xaxt = "n", yaxt = "n", mar = c(0, 0, 0, 0), bty = "n", xaxs = "i")
            plot(x = Obj$Wave1[Which1], y = specx[Which1],
                 col = graphparm$col, type = "l", lwd = lwd.spec, ann = FALSE)
        }
        
        # main Part -----------------------------------------------------------
        screen(3)
        if (is.null(zlim)) {
            zlim <- range(what[Which1, Which2])
        }
        # Number of levels is always odd --------------------------------------
        if (N%%2 == 0){
            N <- N + 1
        }
        # Symmetric distribution of color code --------------------------------
        Where <- seq(-max(abs(zlim)), max(abs(zlim)), length.out = N) 
        
        if (is.null(Cutout)) {
            OM <- which(Where < 0)
            OP <- which(Where > 0)
        } else {
            OM <- which(Where <= Cutout[1])
            OP <- which(Where >= Cutout[2])
        }
        
        COL <- rep("transparent", length(Where))
        COL[OM] <- fields::designer.colors(col = c("darkblue", "cyan"), n = length(OM))
        COL[OP] <- fields::designer.colors(col = c("yellow", "red", "darkred"), n = length(OP))
        COL[(N + 1)/2] <- "transparent"
        COL <- COL[which(zlim[1] < Where & Where < zlim[2])]
        Where <- seq(zlim[1], zlim[2], length.out = length(COL))
        
        par(xaxt = "n", yaxt = "n", mar = c(0, 0, 0, 0), bty = "n", xaxs = "i", yaxs = "i")
        if (Contour == TRUE){
            graphics::contour(x = Obj$Wave1[Which1], y = Obj$Wave2[Which2], z = what[Which1, Which2],
                              col = COL, levels = Where, zlim = zlim, drawlabels = FALSE,
                              lwd = graphparm$lwd, ...)
        } else {
            graphics::image(x = Obj$Wave1[Which1], y = Obj$Wave2[Which2], z = what[Which1, Which2],
                            col = COL, xlab = "", ylab = "", zlim = zlim,
                            lwd = graphparm$lwd, ...)
        }
        
        abline(a = 0, b = 1, col = rgb(red = 1, green = 1, blue = 1, alpha = 0.5),
            lwd = graphparm$lwd)
        par(xpd = NA, xaxt = "s", yaxt = "s", xaxs = "i", yaxs = "i", cex = graphparm$cex,
            mar = c(0, 0, 0, 0))
        box(which = "figure", lwd = lwd.axis, col = graphparm$col)
        if ((axes == 1) | (axes == 3)){
            axis(side = 1, at = at.xaxs, labels = label.xaxs, lwd = lwd.axis,
                 col = graphparm$col, col.ticks = graphparm$col,
                 cex.axis = graphparm$cex.axis, col.axis = graphparm$col.axis,
                 font.axis = graphparm$font.axis)
        }
        if ((axes == 2) | (axes == 3)){
            axis(side = 2, las = 2, at = at.yaxs, labels = label.yaxs,
                 lwd = lwd.axis, col = graphparm$col, col.ticks = graphparm$col,
                 cex.axis = graphparm$cex.axis, col.axis = graphparm$col.axis,
                 font.axis = graphparm$font.axis)
        }
        
        mtext(side = 1, xlab, line = line.xlab, cex = graphparm$cex.lab * 1.3,
              col = graphparm$col.lab, font = graphparm$font.lab)
        mtext(side = 2, ylab, line = line.ylab, cex = graphparm$cex.lab * 1.3,
              col = graphparm$col.lab, font = graphparm$font.lab)
        
        if(Legend == TRUE){
            # top right -------------------------------------------------------
            screen(7)
            # avoid par(par.old) error from image.plot() by setting par(pin) value positive
            par(pin = abs(par()$pin))
            
            if (Contour == TRUE){
                fields::image.plot(z = what[Which1,Which2], legend.only = TRUE,
                    smallplot = c(0.15, 0.3, 0.2, 0.8), col = COL,
                    axis.args = list(at = quantile(Where, prob = c(0.1, 0.9)),
                        labels = format(x = quantile(Where, prob = c(0.1, 0.9)),
                        digit = 2, scientific = TRUE), cex.axis = cex.leg),
                    zlim = zlim, graphics.reset = TRUE)
            } else {
                fields::image.plot(z = what[Which1, Which2],legend.only = TRUE,
                    smallplot = c(0.15, 0.3, 0.2, 0.8), col = COL,
                    axis.args = list(at = range(what[Which1, Which2]),
                        labels = format(x = range(what[Which1, Which2]),
                        digits = 2, scientific = TRUE), cex.axis = cex.leg),
                    graphics.reset = TRUE)
            }
        
        }
        
        screen(3, new = FALSE)
        close.screen(c(1,2,4,5,6,7))
    }

main <- function() {
    args <- parse_args(commandArgs(trailingOnly = TRUE))
    mat1 = load_csv_to_matrix(args$file1)
    mat2 = load_csv_to_matrix(args$file2)
   
    library("stringr")
    library("corr2D")
    twod <- corr2d(mat1, mat2, corenumber = parallel::detectCores())
    
    pdf(str_replace(str_interp("corr2d-${Sys.time()}.pdf"), " ", ""))
    plot_corr2d_custom(twod, N = args$contour)
    dev.off()
}

main()

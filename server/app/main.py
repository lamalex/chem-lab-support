import json
import logging
from pathlib import Path
from aiohttp import web
from multidict import MultiDict

from .plotter import plot_from_csv

UPLOAD_PATH = Path('/tmp/pilates/uploads')

async def handlePlotConfigPart(part):
    raw = await part.text()
    try:
        plotConfig = json.loads(raw)
        return plotConfig
    except json.decoder.JSONDecodeError:
        logging.error("plotConfig object was not valid json: {}".format(raw))

async def handleFilePart(part):
    filename = part.filename

    size = 0
    filepath = UPLOAD_PATH.joinpath(filename)
    with open(filepath, 'wb') as f:
        while True:
            chunk = await part.read_chunk()
            if not chunk:
                break
            size += len(chunk)
            f.write(chunk)

    return filepath

async def handle_csv_submission(request):
    filepath = None
    plotConfig = None
    reader = await request.multipart()
    while True:
        part = await reader.next()
        if not part:
            break

        if part.name == 'plotConfig':
                plotConfig = await handlePlotConfigPart(part)
        elif part.name == 'file':
                filepath = await handleFilePart(part)
        else:
            logging.info("Unexpected form part! {}".format(part.name))

    plots = [str(Path('/plots').joinpath(p)) for p in plot_from_csv(filepath, plotConfig)]
    data = {'images': plots}
    return web.json_response(data,
                        headers=MultiDict(
                            {'Access-Control-Allow-Origin': '*'}
                        )
    )

async def create_app():
    app = web.Application()
    app.update(
        static_root_url='/static/',
    )

    app.router.add_get('/api/', lambda x: web.json_response({'reply': 'hello'}))
    app.router.add_post('/api/upload', handle_csv_submission)
    return app

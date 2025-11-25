#!/usr/bin/env python3
"""
Project Manager - GNSS Professional
Gestor de proyectos, puntos, y exportación de datos
"""

import os
import json
import csv
from datetime import datetime
from pathlib import Path
import math


class ProjectManager:
    """Gestor de proyectos y puntos GNSS"""

    def __init__(self, data_dir='data'):
        self.data_dir = Path(data_dir)
        self.projects_dir = self.data_dir / 'projects'
        self.points_dir = self.data_dir / 'points'

        # Crear directorios si no existen
        self.projects_dir.mkdir(parents=True, exist_ok=True)
        self.points_dir.mkdir(parents=True, exist_ok=True)

        # Proyecto actual
        self.current_project = None

    # ========================================================================
    # GESTIÓN DE PROYECTOS
    # ========================================================================

    def create_project(self, name, description='', datum='WGS84', zone='', settings=None):
        """Crear un nuevo proyecto"""
        project_id = self._generate_project_id(name)

        project_data = {
            'id': project_id,
            'name': name,
            'description': description,
            'datum': datum,
            'zone': zone,
            'created': datetime.now().isoformat(),
            'modified': datetime.now().isoformat(),
            'settings': settings or {
                'coordinate_system': 'geographic',  # geographic, utm, local
                'altitude_reference': 'ellipsoidal',  # ellipsoidal, orthometric
                'angle_units': 'decimal',  # decimal, dms
                'distance_units': 'meters',
                'precision': {
                    'horizontal': 0.020,  # metros
                    'vertical': 0.030
                }
            },
            'statistics': {
                'total_points': 0,
                'rtk_fixed': 0,
                'rtk_float': 0,
                'single': 0
            }
        }

        # Guardar proyecto
        project_file = self.projects_dir / f"{project_id}.json"
        with open(project_file, 'w') as f:
            json.dump(project_data, f, indent=2)

        # Crear directorio de puntos para el proyecto
        project_points_dir = self.points_dir / project_id
        project_points_dir.mkdir(exist_ok=True)

        return project_data

    def _generate_project_id(self, name):
        """Generar ID único para proyecto"""
        # Sanitizar nombre
        safe_name = ''.join(c if c.isalnum() or c in '-_' else '_' for c in name)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        return f"{safe_name}_{timestamp}"

    def list_projects(self):
        """Listar todos los proyectos"""
        projects = []

        for project_file in self.projects_dir.glob('*.json'):
            try:
                with open(project_file, 'r') as f:
                    project = json.load(f)
                    projects.append(project)
            except Exception:
                continue

        # Ordenar por fecha de modificación (más recientes primero)
        projects.sort(key=lambda x: x.get('modified', ''), reverse=True)

        return projects

    def get_project(self, project_id):
        """Obtener datos de un proyecto"""
        project_file = self.projects_dir / f"{project_id}.json"

        if not project_file.exists():
            return None

        with open(project_file, 'r') as f:
            return json.load(f)

    def update_project(self, project_id, updates):
        """Actualizar datos de un proyecto"""
        project = self.get_project(project_id)

        if not project:
            return None

        # Actualizar campos
        project.update(updates)
        project['modified'] = datetime.now().isoformat()

        # Guardar
        project_file = self.projects_dir / f"{project_id}.json"
        with open(project_file, 'w') as f:
            json.dump(project, f, indent=2)

        return project

    def delete_project(self, project_id):
        """Eliminar un proyecto y sus puntos"""
        # Eliminar archivo de proyecto
        project_file = self.projects_dir / f"{project_id}.json"
        if project_file.exists():
            project_file.unlink()

        # Eliminar directorio de puntos
        project_points_dir = self.points_dir / project_id
        if project_points_dir.exists():
            for point_file in project_points_dir.glob('*.json'):
                point_file.unlink()
            project_points_dir.rmdir()

        return True

    def set_current_project(self, project_id):
        """Establecer proyecto actual"""
        project = self.get_project(project_id)
        if project:
            self.current_project = project_id
            return True
        return False

    # ========================================================================
    # GESTIÓN DE PUNTOS
    # ========================================================================

    def add_point(self, project_id, point_id, lat, lon, alt, quality=4,
                  hdop=1.0, satellites=0, occupation_time=0, notes='',
                  tilt_data=None, metadata=None):
        """Agregar un punto al proyecto"""

        point_data = {
            'id': point_id,
            'project_id': project_id,
            'timestamp': datetime.now().isoformat(),
            'coordinates': {
                'latitude': lat,
                'longitude': lon,
                'altitude': alt,
                'ellipsoidal_height': alt
            },
            'quality': {
                'fix_type': quality,
                'fix_type_name': self._quality_name(quality),
                'hdop': hdop,
                'satellites': satellites,
                'occupation_time': occupation_time
            },
            'tilt': tilt_data or {
                'enabled': False,
                'pitch': 0.0,
                'roll': 0.0,
                'heading': 0.0,
                'pole_height': 0.0
            },
            'notes': notes,
            'metadata': metadata or {}
        }

        # Guardar punto
        project_points_dir = self.points_dir / project_id
        project_points_dir.mkdir(exist_ok=True)

        point_file = project_points_dir / f"{point_id}.json"
        with open(point_file, 'w') as f:
            json.dump(point_data, f, indent=2)

        # Actualizar estadísticas del proyecto
        self._update_project_stats(project_id)

        return point_data

    def _quality_name(self, quality):
        """Obtener nombre del tipo de fix"""
        quality_map = {
            0: 'NO_FIX',
            1: 'SINGLE',
            2: 'DGPS',
            4: 'RTK_FIXED',
            5: 'RTK_FLOAT'
        }
        return quality_map.get(quality, 'UNKNOWN')

    def list_points(self, project_id):
        """Listar puntos de un proyecto"""
        points = []

        project_points_dir = self.points_dir / project_id
        if not project_points_dir.exists():
            return points

        for point_file in project_points_dir.glob('*.json'):
            try:
                with open(point_file, 'r') as f:
                    point = json.load(f)
                    points.append(point)
            except Exception:
                continue

        # Ordenar por timestamp
        points.sort(key=lambda x: x.get('timestamp', ''))

        return points

    def get_point(self, project_id, point_id):
        """Obtener datos de un punto"""
        point_file = self.points_dir / project_id / f"{point_id}.json"

        if not point_file.exists():
            return None

        with open(point_file, 'r') as f:
            return json.load(f)

    def update_point(self, project_id, point_id, updates):
        """Actualizar datos de un punto"""
        point = self.get_point(project_id, point_id)

        if not point:
            return None

        # Actualizar campos
        point.update(updates)

        # Guardar
        point_file = self.points_dir / project_id / f"{point_id}.json"
        with open(point_file, 'w') as f:
            json.dump(point, f, indent=2)

        return point

    def delete_point(self, project_id, point_id):
        """Eliminar un punto"""
        point_file = self.points_dir / project_id / f"{point_id}.json"

        if point_file.exists():
            point_file.unlink()
            self._update_project_stats(project_id)
            return True

        return False

    def _update_project_stats(self, project_id):
        """Actualizar estadísticas del proyecto"""
        points = self.list_points(project_id)

        stats = {
            'total_points': len(points),
            'rtk_fixed': sum(1 for p in points if p['quality']['fix_type'] == 4),
            'rtk_float': sum(1 for p in points if p['quality']['fix_type'] == 5),
            'single': sum(1 for p in points if p['quality']['fix_type'] == 1)
        }

        self.update_project(project_id, {'statistics': stats})

    # ========================================================================
    # EXPORTACIÓN DE DATOS
    # ========================================================================

    def export_to_csv(self, project_id, output_file=None):
        """Exportar puntos a CSV"""
        points = self.list_points(project_id)

        if not points:
            return None

        if not output_file:
            output_file = self.data_dir / f"{project_id}_export.csv"

        with open(output_file, 'w', newline='') as csvfile:
            fieldnames = [
                'Point_ID', 'Latitude', 'Longitude', 'Altitude',
                'Fix_Type', 'HDOP', 'Satellites', 'Timestamp', 'Notes'
            ]
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

            writer.writeheader()
            for point in points:
                writer.writerow({
                    'Point_ID': point['id'],
                    'Latitude': point['coordinates']['latitude'],
                    'Longitude': point['coordinates']['longitude'],
                    'Altitude': point['coordinates']['altitude'],
                    'Fix_Type': point['quality']['fix_type_name'],
                    'HDOP': point['quality']['hdop'],
                    'Satellites': point['quality']['satellites'],
                    'Timestamp': point['timestamp'],
                    'Notes': point.get('notes', '')
                })

        return str(output_file)

    def export_to_dxf(self, project_id, output_file=None):
        """Exportar puntos a DXF (formato CAD)"""
        points = self.list_points(project_id)

        if not points:
            return None

        if not output_file:
            output_file = self.data_dir / f"{project_id}_export.dxf"

        # Header DXF básico
        dxf_content = [
            "0\nSECTION\n2\nHEADER\n0\nENDSEC\n",
            "0\nSECTION\n2\nTABLES\n0\nENDSEC\n",
            "0\nSECTION\n2\nENTITIES\n"
        ]

        # Agregar puntos
        for point in points:
            lat = point['coordinates']['latitude']
            lon = point['coordinates']['longitude']
            alt = point['coordinates']['altitude']
            point_id = point['id']

            # Convertir lat/lon a coordenadas proyectadas (simplificado)
            # En producción usar pyproj para transformación correcta
            x = lon * 111320  # aprox metros
            y = lat * 110540  # aprox metros
            z = alt

            # Entidad POINT en DXF
            dxf_content.append(
                f"0\nPOINT\n8\n0\n10\n{x}\n20\n{y}\n30\n{z}\n"
            )

            # Texto con ID del punto
            dxf_content.append(
                f"0\nTEXT\n8\n0\n10\n{x}\n20\n{y}\n30\n{z}\n40\n1.0\n1\n{point_id}\n"
            )

        # Footer DXF
        dxf_content.append("0\nENDSEC\n0\nEOF\n")

        # Escribir archivo
        with open(output_file, 'w') as f:
            f.write(''.join(dxf_content))

        return str(output_file)

    def export_to_kml(self, project_id, output_file=None):
        """Exportar puntos a KML (Google Earth)"""
        points = self.list_points(project_id)
        project = self.get_project(project_id)

        if not points:
            return None

        if not output_file:
            output_file = self.data_dir / f"{project_id}_export.kml"

        # KML header
        kml_content = [
            '<?xml version="1.0" encoding="UTF-8"?>\n',
            '<kml xmlns="http://www.opengis.net/kml/2.2">\n',
            '<Document>\n',
            f'<name>{project["name"]}</name>\n',
            f'<description>{project.get("description", "")}</description>\n'
        ]

        # Estilos
        kml_content.append(
            '<Style id="rtk_fixed">\n'
            '  <IconStyle><color>ff00ff00</color><scale>0.8</scale></IconStyle>\n'
            '</Style>\n'
            '<Style id="rtk_float">\n'
            '  <IconStyle><color>ff00ffff</color><scale>0.8</scale></IconStyle>\n'
            '</Style>\n'
            '<Style id="single">\n'
            '  <IconStyle><color>ff0000ff</color><scale>0.8</scale></IconStyle>\n'
            '</Style>\n'
        )

        # Agregar puntos
        for point in points:
            lat = point['coordinates']['latitude']
            lon = point['coordinates']['longitude']
            alt = point['coordinates']['altitude']
            point_id = point['id']
            fix_type = point['quality']['fix_type']

            # Determinar estilo según calidad
            if fix_type == 4:
                style = 'rtk_fixed'
            elif fix_type == 5:
                style = 'rtk_float'
            else:
                style = 'single'

            kml_content.append(
                '<Placemark>\n'
                f'  <name>{point_id}</name>\n'
                f'  <description>'
                f'Fix: {point["quality"]["fix_type_name"]}, '
                f'HDOP: {point["quality"]["hdop"]}, '
                f'Sats: {point["quality"]["satellites"]}'
                f'</description>\n'
                f'  <styleUrl>#{style}</styleUrl>\n'
                f'  <Point>\n'
                f'    <coordinates>{lon},{lat},{alt}</coordinates>\n'
                f'  </Point>\n'
                '</Placemark>\n'
            )

        # KML footer
        kml_content.append('</Document>\n</kml>\n')

        # Escribir archivo
        with open(output_file, 'w') as f:
            f.write(''.join(kml_content))

        return str(output_file)

    def export_to_geojson(self, project_id, output_file=None):
        """Exportar puntos a GeoJSON"""
        points = self.list_points(project_id)
        project = self.get_project(project_id)

        if not points:
            return None

        if not output_file:
            output_file = self.data_dir / f"{project_id}_export.geojson"

        # Construir GeoJSON
        features = []
        for point in points:
            feature = {
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [
                        point['coordinates']['longitude'],
                        point['coordinates']['latitude'],
                        point['coordinates']['altitude']
                    ]
                },
                'properties': {
                    'id': point['id'],
                    'fix_type': point['quality']['fix_type_name'],
                    'hdop': point['quality']['hdop'],
                    'satellites': point['quality']['satellites'],
                    'timestamp': point['timestamp'],
                    'notes': point.get('notes', '')
                }
            }
            features.append(feature)

        geojson = {
            'type': 'FeatureCollection',
            'name': project['name'],
            'features': features
        }

        # Escribir archivo
        with open(output_file, 'w') as f:
            json.dump(geojson, f, indent=2)

        return str(output_file)


# ===========================================================================
# FUNCIONES DE UTILIDAD
# ===========================================================================

def calculate_distance(lat1, lon1, lat2, lon2):
    """Calcular distancia entre dos puntos (fórmula Haversine)"""
    R = 6371000  # Radio de la Tierra en metros

    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = math.sin(delta_phi/2)**2 + \
        math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))

    distance = R * c
    return distance


def main():
    """Función de prueba"""
    pm = ProjectManager()

    # Crear proyecto de ejemplo
    project = pm.create_project(
        name="Levantamiento Prueba",
        description="Proyecto de prueba",
        datum="WGS84"
    )
    print(f"Proyecto creado: {project['id']}")

    # Agregar algunos puntos
    pm.add_point(
        project['id'],
        'P001',
        lat=-33.4489,
        lon=-70.6693,
        alt=570.5,
        quality=4,
        hdop=0.8,
        satellites=12,
        notes='Punto de control'
    )

    pm.add_point(
        project['id'],
        'P002',
        lat=-33.4490,
        lon=-70.6694,
        alt=571.2,
        quality=4,
        hdop=0.9,
        satellites=11
    )

    # Listar puntos
    points = pm.list_points(project['id'])
    print(f"\nPuntos en proyecto: {len(points)}")
    for point in points:
        print(f"  - {point['id']}: {point['coordinates']}")

    # Exportar
    csv_file = pm.export_to_csv(project['id'])
    print(f"\nExportado a CSV: {csv_file}")

    kml_file = pm.export_to_kml(project['id'])
    print(f"Exportado a KML: {kml_file}")


if __name__ == '__main__':
    main()
